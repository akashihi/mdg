package services

import javax.inject.Inject
import java.time.LocalDate

import controllers.dto.{OperationDto, TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.ordering.{Page, SortBy}
import models.{Account, Operation, Transaction}
import slick.jdbc.PostgresProfile.api._
import util.EitherD._
import validators.Validator._
import scalaz._
import Scalaz._
import dao.{ElasticSearch, SqlDatabase, SqlExecutionContext}
import dao.queries.{AccountQuery, TagQuery, TransactionQuery}

import scala.concurrent._

/**
  * Transaction operations service.
  */
class TransactionService @Inject() (protected val es: ElasticSearch, protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {

  /**
    * Clears transaction of empty operations.
    * @param tx Transaction (DTO) to process.
    * @return Transaction (DTO) without useless operations.
    */
  def stripEmptyOps(tx: TransactionDto): TransactionDto =
    tx.copy(operations = removeEmptyOps(tx.operations))

  /**
    * Removes empty operations from list of (DTO) operations.
    * Empty operation is the operation that doesn't influences
    * transaction balance (i.e. with amount equal to zero).
    *
    * @param ops list to process.
    * @return list with non-empty operations only.
    */
  def removeEmptyOps(ops: Seq[OperationDto]): Seq[OperationDto] =
    ops.filter(o => o.amount != 0)

  /**
    * Extracts Transaction (DTO) data from the
    * supplied wrapper and checks for data validity.
    * @param id Separately defined transaction id.
    * @param wrapper TransactionWrapperDto object.
    * @return Error XOR valid Transaction(DTO) object.
    */
  def prepareTransactionDto(id: Option[Long],
                            wrapper: Option[TransactionWrapperDto])
    : EitherF[String, TransactionDto] = {
    val dto = AccountQuery.listAll.map { accounts =>
      val validator = validate(accounts)(_)
      wrapper
        .fromOption("TRANSACTION_DATA_INVALID")
        .map(_.data.attributes)
        .map(_.copy(id = id))
        .map { stripEmptyOps }
        .map { validator }
        .flatMap { validationToXor }
    }
    EitherT(sql.query(dto))
  }

  /**
    * Converts transaction object to the DTO.
    * @param tx Transaction to convert.
    * @return Fully filled DTO object.
    */
  def txToDto(tx: Transaction): Future[TransactionDto] = {
    val dto = for {
      o <- TransactionQuery
        .listOperations(tx.id.get)
        .map(x =>
          x.map(o => OperationDto(o.account_id, o.amount, o.rate.some)))
      t <- TransactionQuery.listTags(tx.id.get).map(x => x.map(_.txtag))
    } yield TransactionDto(Some(tx.id.get), tx.timestamp, tx.comment, operations = o, tags = t)
    sql.query(dto)
  }

  /**
    * Creates new transaction.
    * @param tx transaction description object.
    * @return transaction description object with id.
    */
  def add(tx: TransactionDto): Future[TransactionDto] = {
    val transaction = Transaction(tx.id, tx.timestamp, tx.comment)
    val tags = DBIO.sequence(tx.tags.map(TagQuery.ensureIdByValue))
    val operations = tx.operations.map { x =>
      Operation(-1, -1, x.account_id, x.amount, x.rate.getOrElse(BigDecimal(1)))
    }
    val txWithId = sql.query(tags.flatMap(TransactionQuery.insert(transaction, operations, _)))
    txWithId.flatMap { t => es.saveComment(t.id.get, t.comment.getOrElse("")); txWithId}
      .flatMap(txToDto)
  }

  /**
    * Returns all transaction objects from the database.
    * @return Sequence of transaction DTOs.
    */
  def list(filter: TransactionFilter,
           sort: Seq[SortBy],
           page: Option[Page]): Future[(Seq[TransactionDto], Int)] = {
    val commentsIds = filter.comment.map(es.lookupComment).getOrElse(Future.successful(Array[Long]()))
    val list = commentsIds.map(TransactionQuery.list(filter, sort, page, _))
      .flatMap(sql.query)
      .map(_.map(txToDto)).flatMap(Future.sequence(_))
    val count = commentsIds.map(TransactionQuery.count(filter,_)).flatMap(sql.query)

    list zip count
  }

  /**
    * Retrieves specific Transaction.
    * @param id transaction unique id.
    * @return DTO object.
    */
  def get(id: Long): OptionF[TransactionDto] = {
    val query = TransactionQuery.findById(id)
    OptionT(sql.query(query)).flatMapF(txToDto)
  }

  /**
    * Replaces specified transaction with new one
    * @param id Transaction to replace
    * @param tx New transaction data
    * @return either error result or replaced transaction
    */
  def replace(id: Long, tx: TransactionDto): Future[\/[String, TransactionDto]] = {
    sql.query(TransactionQuery.delete(id)).flatMap {
      case 1 => add(tx) map (_.right)
      case _ => Future.successful("TRANSACTION_NOT_FOUND".left)
    }
  }

  /**
    * Removes transaction and all dependent objects.
    *
    * @param id identificator of transaction to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): Future[\/[String, Int]] = {
    val query = TransactionQuery.delete(id).map {
      case 1 => 1.right
      case _ => "TRANSACTION_NOT_FOUND".left
    }
    sql.query(query)
  }

  /**
    * Calculates total of operations on specified accounts during specified period.
    * @param from period first day.
    * @param till period last day.
    * @param accounts list of accounts to operate on.
    * @return sum of all operation on specified account during specified period.
    */
  def getTotalsForDate(from: LocalDate, till: LocalDate)(
      accounts: Seq[Account]): DBIO[BigDecimal] = {
    TransactionQuery.transactionsForPeriod(from, till).flatMap { txId =>
      val ops = TransactionQuery.listOperations(txId)
      ops.map(s => s.map({o =>
        val account = accounts.find(_.id.get == o.account_id)
        account.map(a => RateService.getCurrentRateToPrimary(a.currency_id).map(_.rate * o.amount).run.map(_.getOrElse(BigDecimal(0))))
          .getOrElse(DBIO.successful(BigDecimal(0)))
      }))
        .flatMap(DBIO.sequence(_))
        .map(_.foldLeft(BigDecimal(0))(_ + _))
    }
  }

  /**
    * Recreates transaction index from scratch.
    * @return True in case of success
    */
  def reindexTransactions(): Future[Boolean] = {
    def create = OptionT(es.createMdgIndex().map(_.option(1)))
    def drop = OptionT(es.dropMdgIndex().map(_.option(1)))
    def save = sql.query(TransactionQuery.listAll)
    def index(transactions: Seq[Transaction]) = transactions.map(tx => es.saveComment(tx.id.get, tx.comment.getOrElse("")))

    val result = drop.map(_ => create).flatMapF(_ => save).map(index).flatMapF(Future.sequence(_)).map(_.exists(!_)).map(!_)

    result.getOrElse(false)
  }
}
