package services

import javax.inject.Inject
import java.time.LocalDate

import controllers.dto.{OperationDto, TransactionDto, TransactionWrapperDto}
import dao.filters.{AccountFilter, TransactionFilter}
import dao.ordering.{Page, SortBy}
import models.{Account, Operation, Transaction}
import slick.jdbc.PostgresProfile.api._
import util.EitherOps._
import validators.Validator._
import scalaz._
import Scalaz._
import akka.NotUsed
import akka.stream._
import akka.stream.scaladsl._
import akka.actor._
import dao.{ElasticSearch, SqlDatabase, SqlExecutionContext}
import dao.queries.{AccountQuery, TagQuery, TransactionQuery}
import util.Default
import play.api.Logger

import scala.concurrent._


/**
  * Transaction operations service.
  */
class TransactionService @Inject() (protected val rs: RateService, protected val es: ElasticSearch,
                                    protected val as: AccountService, protected val sql: SqlDatabase,
                                    implicit protected val acs: ActorSystem)
                                   (implicit ec: SqlExecutionContext) {
  val log: Logger = Logger(this.getClass)

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
    : ErrorF[TransactionDto] = {
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
    txWithId.flatMap { t => es.saveTx(t.id.get, t.comment.getOrElse(""), tx.tags); txWithId}
      .flatMap(txToDto)
  }

  /**
    * Provides you with a stream of transactions from the data base.
    * @param filter Filter to apply on those transactions.
    * @param sort Optionally sort those transactions by specified fields.
    * @param page Optionally limit result by specified page size ond number.
    * @param searchIds Retrieve only transaction, matching specified transaction ids.
    * @return Stream of transaction DTOs.
    */
  def streamTransactions(filter: TransactionFilter,
                         sort: Seq[SortBy],
                         page: Option[Page],
                         searchIds: Array[Long]
                        ): Source[TransactionDto, NotUsed] = {
    import akka.stream.scaladsl._
    implicit val am: ActorMaterializer = ActorMaterializer()

    val query = TransactionQuery.list(filter, sort, page, searchIds)
    Source.fromPublisher(sql.stream(query)).mapAsync(1)(txToDto)
  }

  /**
    * Returns all transaction objects from the database.
    * @return Sequence of transaction DTOs.
    */
  def list(filter: TransactionFilter,
           sort: Seq[SortBy],
           page: Option[Page]): Future[(Seq[TransactionDto], Int)] = {
    import akka.stream.scaladsl._
    implicit val am: ActorMaterializer = ActorMaterializer()

    val commentsIds = filter.comment.map(es.lookupComment).getOrElse(Future.successful(Array[Long]()))
    val tagIds = filter.tag.map(_.mkString(" ")).map(es.lookupTags).getOrElse(Future.successful(Array[Long]()))
    val searchIds = commentsIds zip tagIds map {case(a, b) => a ++ b} map { _.distinct }

    val list = searchIds.map(streamTransactions(filter, sort, page, _)).flatMap(_.runWith(Sink.seq))

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
    * Calculates total of operations in primary currency on specified accounts during specified period.
    * @param from period first day.
    * @param till period last day.
    * @param accounts list of accounts to operate on.
    * @return sum in primary currency of all operation on specified account during specified period.
    */
  def getTotalsForDate(from: LocalDate, till: LocalDate)(
      accounts: Seq[Account]): Future[BigDecimal] = {
    def applyCurrency(o: Operation, a: Account): Future[BigDecimal] =
      rs.getCurrentRateToPrimary(a.currency_id)
      .map(_.rate * o.amount)
      .getOrElse(0)

    def processOp(o: Operation): Future[BigDecimal] =
      accounts.find(_.id.get == o.account_id)
        .map(applyCurrency(o, _))
        .getOrElse(Future.successful(0))

    val operations = sql.query(TransactionQuery.transactionsForPeriod(from, till))
      .map(TransactionQuery.listOperations)
      .flatMap(sql.query)
      .map(_.map(processOp))
      .flatMap(Future.sequence(_))

      operations.map(_.foldLeft(Default.value[BigDecimal])(_ + _))
  }

  /**
    * Recreates transaction index from scratch.
    * @return True in case of success
    */
  def reindexTransactions(): Future[Boolean] = {
    import akka.stream.scaladsl._
    implicit val am: ActorMaterializer = ActorMaterializer()

    log.info("Starting transaction reindexing")
    def create = OptionT(es.createMdgIndex().map(_.option(1)))
    def drop = OptionT(es.dropMdgIndex().map(_.option(1)))
    def saveToIndex(tx: Transaction) = {
      val tags = sql.query(TransactionQuery.listTags(tx.id.get)).map(_.map(_.txtag))
      tags.flatMap(es.saveTx(tx.id.get, tx.comment.getOrElse(""), _))
    }
    def transactions = sql.stream(TransactionQuery.listAll)

    def flow = Source.fromPublisher(transactions).mapAsync(1)(saveToIndex).map(if (_) 0 else 1).toMat(Sink.fold(0)(_ + _))(Keep.right)

    val index = drop.flatMap(_ => create).flatMapF(_ => flow.run())

    index.map {errors => log.warn(s"Transaction reindexing finished with $errors errors"); errors}
        .map(e => e == 0)
      .getOrElse(false)
  }

  def replaceCurrencyForAccount(a: Account):ErrorF[Int] = {
    import akka.stream.scaladsl._
    implicit val am: ActorMaterializer = ActorMaterializer()

    val filter = TransactionFilter(account_id = a.id.map(Seq.apply(_)))
    def flow = streamTransactions(filter, Seq.empty[SortBy], None, Array.emptyLongArray)
      .mapAsync(1)(old => replace(old.id.get, old))
      .map(_.map(_ => 1))
      .toMat(Sink.fold(0)(_ + _.getOrElse(0)))(Keep.right)
    EitherT(flow.run().map(i => i.right[String]))
  }

  /**
    * Here we replace operation amount for account that changes currency.
    * The procedure is straightforward: we know, that each transaction is balanced,
    * so sum of all operations, converted to default rate, is 0. We know,
    * that transaction always have a default currency, so we can base on.
    * What we do to replace currency on the account is:
    *
    * 1)We remove all operations for specified account
    * 2)We detect default currency of the transaction
    * 3)We convert all remaining operations to that currency
    * 4)..and summarize them
    * 5)As we removed operations for changing account, transaction
    * will be unbalanced now and sum of all ops is a remaining
    * amount for account.
    * 6)So we need it to be converted from default currency to
    * account new currency and written as a new op.
    *
    * There is a problem with step 2 - it may happen, that default currency
    * will be lost during step 1. In that case we can recover in two ways -
    * if there is an op with same currency as a new currency of a account, use it as
    * default and recalculate all other rates. If all the other currencies are different,
    * use new account currency as default.
    *
    * @param tx Transaction DTO to process
    * @param a Account to replace
    * @return Recalculated TransactionDTO
    */
  def txReplaceAccCurrency(tx: TransactionDto, a: Account): Future[TransactionDto] = {
    val accounts = as.list(AccountFilter(None, None, None, None))
    // 1 - Remove replaced account
    val accLessOps = tx.operations.filterNot(_.account_id == a.id.get)
    var accLessOpsF: Future[Seq[OperationDto]] = null

    // 2 - Find default currency
    val accountIdWithDefaultCurrency = accLessOps
      .map(o => (o.account_id, o.rate.getOrElse(BigDecimal(1))))
      .filter(_._2 == 1)
      .map(o => o._1)
      .headOption
    val defaultCurrencyId = if (accountIdWithDefaultCurrency.isEmpty) {
      //Ok, our life is much harder now, we need to replace default currency
      //and replace rates
      val currencies = accLessOps
        .map(o => (o, accounts.map(_.filter(_.id.get == o.account_id).head)))
        .map(o => Applicative[Future].tuple2(Future.successful(o._1), o._2))
      var rates = Future.sequence(currencies).map(_.map(o =>(o._1,rs.get(tx.timestamp, o._2.currency_id, a.currency_id))))
        .map(_.map(o => Applicative[Future].tuple2(Future.successful(o._1), o._2)))
        .flatMap(s => Future.sequence(s))
      accLessOpsF = rates.map(_.map(o => o._1.copy(rate = Some(o._2.rate))))

      Future.successful(a.currency_id)
    } else {
      //Load default currency Id from account
      accLessOpsF = Future.successful(accLessOps)
      accounts.map(_.filter(_.id.get == accountIdWithDefaultCurrency.get)
        .map(_.currency_id)
        .head)
    }

    // 3&4 - Convert and summarize
    val disbalance =
      accLessOpsF.map(_.map(o => o.rate.getOrElse(BigDecimal(1)) * o.amount).sum)

    // 5&6 - a disbalance is in transaction default currency, so we need to apply
    // reverse rate, from the default to the account currency and write it.
    val reverseRate = defaultCurrencyId.flatMap(c => rs.get(tx.timestamp, c, a.currency_id)).map(_.rate)
    val convertedOp = reverseRate.flatMap(rate => disbalance.map(d => OperationDto(a.id.get, d * rate, Some(rate))))

    val txOps = convertedOp.flatMap(o => accLessOpsF.map(_ :+ o))
    txOps.map(o => tx.copy(operations = o))
  }
}
