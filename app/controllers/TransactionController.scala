package controllers

import javax.inject.Inject
import controllers.dto.{TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.filters.TransactionFilter._
import dao.ordering.SortBy._
import dao.ordering.{Page, SortBy}
import controllers.api.ResultMaker._
import dao.SqlExecutionContext
import models.Setting
import play.api.libs.json._
import play.api.mvc._
import services.{ErrorService, TransactionService}
import scalaz._
import Scalaz._

/**
  * Transaction REST resource controller
  */
class TransactionController @Inject()(protected val ts: TransactionService, protected val es: ErrorService)
                                     (implicit ec: SqlExecutionContext) extends InjectedController {

  val DEFAULT_PAGE_SIZE = 10

  /**
    * Tries to convert Json data to TransactionWrapperDTO
    *
    * @param data json representation of transaction.
    * @return conversion result.
    */
  def parseDto(data: JsValue): Option[TransactionWrapperDto] =
    data.validate[TransactionWrapperDto].asOpt

  /**
    * Makes Play result form Transaction(DTO)
    *
    * @param tx transaction data
    * @return Wrapped to json data of created transaction.
    */
  def createResult(tx: TransactionDto): Result =
    makeResult(tx)(CREATED)
      .withHeaders("Location" -> s"/api/transaction/${tx.id}")

  /**
    * Makes Play result form Transaction(DTO)
    *
    * @param tx transaction data
    * @return Wrapped to json data of modified transaction.
    */
  def editResult(tx: TransactionDto): Result = makeResult(tx)(ACCEPTED)

  /**
    * Adds new transaction to the system.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    val dto = ts.prepareTransactionDto(None, parseDto(request.body))
    val result = dto.flatMapF{tx => ts.add(tx).map(_.right)}

    result.run.flatMap(x => es.handleErrors(x)(createResult))
  }

  /**
    * Retrieves transactions, matching specified predicates.
    *
    * @return List of transactions wrapped to JSON.
    */
  def index(filter: Option[String],
            sort: Option[String],
            notEarlier: Option[String],
            notLater: Option[String],
            pageSize: Option[Int],
            pageNumber: Option[Int]) = Action.async {
    val filterComment = Lens.lensu[TransactionFilter, Option[String]](
      (a, value) => a.copy(comment = value),
      _.comment)
    val f = filter
      .flatMap { x =>
        Json.parse(x).validate[TransactionFilter].asOpt
      }
      .getOrElse(TransactionFilter())
      .copy(notEarlier = notEarlier, notLater = notLater)

    val filterObj = filterComment.mod(_.filter(!_.trim.isEmpty), f)

    val page = pageNumber.flatMap { no =>
      Some(Page(no, pageSize.getOrElse(DEFAULT_PAGE_SIZE).toLong))
    }

    val ordering: Seq[SortBy] = sort match {
      case Some(x) => x
      case None => Seq[SortBy]()
    }

    ts.list(filterObj, ordering, page)
      .map { x =>
        val (transactions, count) = x
        makeResult(transactions, count)(OK)
      }
  }

  /**
    * Transaction object retrieval method
    *
    * @param id transaction id.
    * @return transaction object.
    */
  def show(id: Long) = Action.async {
    ts.get(id).map(makeResult(_)(OK))
      .getOrElseF(es.makeErrorResult("TRANSACTION_NOT_FOUND"))
  }

  /**
    * Replaces transaction with new one.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val dto = ts.prepareTransactionDto(Some(id), parseDto(request.body))
    val result = dto.flatMapF(ts.replace(id, _))
    result.run.flatMap { x => es.handleErrors(x) { tx => makeResult(tx)(ACCEPTED) } }
  }

  /**
    * Transaction object deletion method
    *
    * @param id transaction to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    ts.delete(id).flatMap(x => es.handleErrors(x) { _ => NoContent })
  }

  /**
    * mnt.transaction.reindex setting method.
    *
    * Not really a setting, triggers transaction fulltext search reindex.
    *
    * @return setting object.
    */
  def reindexTransactions() = Action.async {
    val result = ts.reindexTransactions().map { s => Setting(id = Some("mnt.transaction.reindex"), value = s.toString) }
    result.map(x => makeResult(x)(ACCEPTED))
  }
}
