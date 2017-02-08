package controllers

import javax.inject.Inject

import controllers.JsonWrapper._
import controllers.dto.TransactionWrapperDto
import play.api.libs.json.Json
import play.api.mvc._
import services.{ErrorService, TransactionService}

import scala.concurrent._

/**
  * Transaction REST resource controller
  */
class TransactionController @Inject()(protected val transactionService: TransactionService,
                                      val errors: ErrorService)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Adds new transaction to the system.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    request.body.validate[TransactionWrapperDto].asOpt match {
      case Some(x) =>
        def tx = x.data.attributes.copy(operations = transactionService.stripEmptyOps(x.data.attributes.operations))
        transactionService.invalidateOperations(tx.operations) match {
          case Some(e) => e
          case None => transactionService.add(tx).map {
            r => Created(Json.toJson(wrapJson(r))).as("application/vnd.mdg+json").withHeaders("Location" -> s"/api/transaction/${r.id}")
          }
        }
      case None => errors.errorFor("TRANSACTION_DATA_INVALID")
    }
  }

  /**
    * Retrieves transactions, matching specified predicates.
    * @return List of transactions wrapped to JSON.
    */
  def index = Action.async {
    transactionService.list().map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
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
    * Transaction object deletion method
    *
    * @param id transaction to delete
    * @return HTTP 204 in case of sucess, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    transactionService.delete(id).flatMap {
      case Some(_) => Future(NoContent)
      case None => errors.errorFor("TRANSACTION_NOT_FOUND")
    }
  }
}
