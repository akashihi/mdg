package services

import javax.inject.Inject
import java.time.LocalDate

import controllers.dto.{OperationDto, TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.ordering.{Page, SortBy}
import models.{Account, Operation, Transaction}
import slick.jdbc.PostgresProfile.api._
import util.EitherD
import util.EitherD._
import validators.Validator._
import scalaz._
import Scalaz._
import dao.{ElasticSearch, SqlExecutionContext}
import dao.queries.{AccountQuery, TagQuery, TransactionQuery}

/**
  * Transaction operations service.
  */
class TransactionService @Inject() (protected val es: ElasticSearch)(implicit ec: SqlExecutionContext) {

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
    : DBIO[\/[String, TransactionDto]] = {
    AccountQuery.listAll.map { accounts =>
      val validator = validate(accounts)(_)
      wrapper
        .fromOption("TRANSACTION_DATA_INVALID")
        .map(_.data.attributes)
        .map(_.copy(id = id))
        .map { stripEmptyOps }
        .map { validator }
        .flatMap { validationToXor }
    }
  }

  /**
    * Converts transaction object to the DTO.
    * @param tx Transaction to convert.
    * @return Fully filled DTO object.
    */
  def txToDto(tx: Transaction): DBIO[TransactionDto] = {
    for {
      o <- TransactionQuery
        .listOperations(tx.id.get)
        .map(x =>
          x.map(o => OperationDto(o.account_id, o.amount, o.rate.some)))
      t <- TransactionQuery.listTags(tx.id.get).map(x => x.map(_.txtag))
    } yield
      TransactionDto(Some(tx.id.get),
                     tx.timestamp,
                     tx.comment,
                     operations = o,
                     tags = t)
  }

  /**
    * Creates new transaction.
    * @param tx transaction description object.
    * @return transaction description object with id.
    */
  def add(tx: TransactionDto): DBIO[TransactionDto] = {
    val transaction = Transaction(tx.id, tx.timestamp, tx.comment)
    val tags = DBIO.sequence(tx.tags.map(TagQuery.ensureIdByValue))
    val operations = tx.operations.map { x =>
      Operation(-1, -1, x.account_id, x.amount, x.rate.getOrElse(1))
    }
    tags
      .flatMap { txTags =>
        TransactionQuery.insert(transaction, operations, txTags)
      }.map(tx => {
        es.saveComment(tx.id.get, tx.comment.getOrElse(""))
      tx
    })
      .flatMap(txToDto)
  }

  /**
    * Returns all transaction objects from the database.
    * @return Sequence of transaction DTOs.
    */
  def list(filter: TransactionFilter,
           sort: Seq[SortBy],
           page: Option[Page]): DBIO[(Seq[TransactionDto], Int)] = {
    val commentsIds = filter.comment.map(es.lookupComment).getOrElse(Array[Long]())
    val list = TransactionQuery
      .list(filter, sort, page, commentsIds)
      .flatMap(s => DBIO.sequence(s.map(t => txToDto(t))))
    val count = TransactionQuery.count(filter, commentsIds)

    list zip count
  }

  /**
    * Retrieves specific Transaction.
    * @param id transaction unique id.
    * @return DTO object.
    */
  def get(id: Long): DBIO[Option[TransactionDto]] = {
    val tx = TransactionQuery.findById(id)
    tx.flatMap {
      case Some(x) => txToDto(x).map(t => Some(t))
      case None => DBIO.successful(None)
    }
  }

  def replace(id: Long, tx: TransactionDto): DBIO[\/[String, TransactionDto]] = {
    TransactionQuery.delete(id).flatMap {
      case 1 => add(tx) map (_.right)
      case _ => DBIO.successful("TRANSACTION_NOT_FOUND".left)
    }
  }

  /**
    * Removes transaction and all dependent objects.
    *
    * @param id identificator of transaction to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    TransactionQuery.delete(id).map {
      case 1 => 1.right
      case _ => "TRANSACTION_NOT_FOUND".left
    }
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
}
