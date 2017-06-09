package controllers

import javax.inject.Inject

import controllers.dto.{TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.filters.TransactionFilter._
import dao.ordering.SortBy._
import dao.ordering.{Page, SortBy}
import api.ErrorHandler._
import controllers.api.ResultMaker._
import util.ApiOps._
import play.api.libs.json._
import play.api.mvc._
import services.{ErrorService, TransactionService}
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._
import scalaz._

/**
  * Transaction REST resource controller
  */
class TransactionController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    val errors: ErrorService)(implicit ec: ExecutionContext)
    extends Controller {

  val db = dbConfigProvider.get[JdbcProfile].db

  /**
    * Tries to convert Json data to TransactionWrapperDTO
    * @param data json representation of transaction.
    * @return conversion result.
    */
  def parseDto(data: JsValue): Option[TransactionWrapperDto] = data.validate[TransactionWrapperDto].asOpt

  /**
    * Makes Play result form Transaction(DTO)
    *
    * @param tx transaction data
    * @return Wrapped to json data of created transaction.
    */
  def createResult(tx: TransactionDto): Result = makeResult(tx)(CREATED).withHeaders("Location" -> s"/api/transaction/${tx.id}")

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
    val tx = TransactionService.prepareTransactionDto(None, parseDto(request.body)).map(TransactionService.add)
    val result = handleErrors(tx, createResult _)
    db.run(result)
  }

  /**
    * Retrieves transactions, matching specified predicates.
    * @return List of transactions wrapped to JSON.
    */
  def index(filter: Option[String],
            sort: Option[String],
            notEarlier: Option[String],
            notLater: Option[String],
            pageSize: Option[Int],
            pageNumber: Option[Int]) = Action.async {
    val f = filter.flatMap { x =>
      Json.parse(x).validate[TransactionFilter].asOpt
    }.getOrElse(TransactionFilter())
      .copy(notEarlier = notEarlier, notLater = notLater)

    val page = (pageSize, pageNumber) match {
      case (Some(size), Some(no)) => Some(Page(no, size))
      case _ => None
    }

    val ordering: Seq[SortBy] = sort match {
      case Some(x) => x
      case None => Seq[SortBy]()
    }

    val result = TransactionService.list(f, ordering, page).map(x => makeResult(x)(OK))
    db.run(result)
  }

  /**
    * Transaction object retrieval method
    * @param id transaction id.
    * @return transaction object.
    */
  def show(id: Long) = Action.async {
    val result = TransactionService.get(id).flatMap {
      case None => makeErrorResult("TRANSACTION_NOT_FOUND")
      case Some(x) => DBIO.successful(makeResult(x)(OK))
    }
    db.run(result)
  }

  /**
    * Replaces transaction with new one.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val tx = TransactionService.prepareTransactionDto(Some(id), parseDto(request.body))
    val result = tx match {
      case -\/(e) => makeErrorResult(e) //Fail fast
      case \/-(dto) => TransactionService.replace(id, dto).flatMap(x => handleErrors(x, editResult _));
    }
    db.run(result)
  }

  /**
    * Transaction object deletion method
    *
    * @param id transaction to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    def deleteResult(v: Int) = NoContent
    val result = TransactionService.delete(id).flatMap(x => handleErrors(x, deleteResult _))
    db.run(result)
  }
}
