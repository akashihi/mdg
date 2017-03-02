package controllers

import javax.inject.Inject

import controllers.JsonWrapper._
import controllers.dto.{TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.filters.TransactionFilter._
import dao.ordering.SortBy._
import dao.ordering.{Page, SortBy}
import play.api.libs.json._
import play.api.mvc._
import services.{ErrorService, TransactionService}

import scala.concurrent._

/**
  * Transaction REST resource controller
  */
class TransactionController @Inject()(protected val transactionService: TransactionService,
                                      val errors: ErrorService)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Common transaction modification function.
    * Retrieves transaction DTO from the json,
    * checks for data validity.
    * @param data json representation of transaction.
    * @param op modification operation to be done.
    * @return result of modification operation.
    */
  def modifyTransaction(id: Option[Long], data: JsValue, op: (TransactionDto) => Future[Result]): Future[Result] = {
    data.validate[TransactionWrapperDto].asOpt match {
      case Some(x) =>
        def tx = x.data.attributes.copy(id = id, operations = transactionService.stripEmptyOps(x.data.attributes.operations))
        transactionService.invalidateOperations(tx.operations) match {
          case Some(e) => e
          case None => op(tx)
        }
      case None => errors.errorFor("TRANSACTION_DATA_INVALID")
    }
  }

  /**
    * Transaction creation operation.
    *
    * Takes transaction DTO and created it in the system.
    * @param tx transaction data to create
    * @return Wrapped to json data of newly created transaction.
    */
  def createOp(tx: TransactionDto): Future[Result] = transactionService.add(tx).map {
    r => Created(Json.toJson(wrapJson(r))).as("application/vnd.mdg+json").withHeaders("Location" -> s"/api/transaction/${r.id}")
  }

  /**
    * Adds new transaction to the system.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    modifyTransaction(None, request.body, createOp)
  }

  /**
    * Retrieves transactions, matching specified predicates.
    * @return List of transactions wrapped to JSON.
    */
  def index(
             filter: Option[String],
             sort: Option[String],
             notEarlier: Option[String],
             notLater: Option[String],
             pageSize: Option[Int],
             pageNumber: Option[Int]) = Action.async {
    val f = (filter match {
      case Some(x) => Json.parse(x).validate[TransactionFilter].asOpt.getOrElse(TransactionFilter())
      case None => TransactionFilter()
    }).copy(notEarlier = notEarlier, notLater = notLater)

    val page = (pageSize, pageNumber) match {
      case (Some(size), Some(no)) => Some(Page(no, size))
      case _ => None
    }

    transactionService.list(f,
      sort match {
        case Some(x) => x
        case None => Seq[SortBy]()
      },
      page
    ).map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }

  /**
    * Transaction object retrieval method
    * @param id transaction id.
    * @return transaction object.
    */
  def show(id: Long) = Action.async {
    transactionService.get(id).flatMap {
      case None => errors.errorFor("TRANSACTION_NOT_FOUND")
      case Some(x) => Future(Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
    }
  }

  /**
    * Replaces transaction with new one.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    modifyTransaction(Some(id), request.body, (tx: TransactionDto) => transactionService.delete(id, () => createOp(tx)))
  }

  /**
    * Transaction object deletion method
    *
    * @param id transaction to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    transactionService.delete(id, () => Future(NoContent))
  }
}
