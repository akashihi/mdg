package controllers

import javax.inject.Inject
import controllers.dto.{TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.filters.TransactionFilter._
import dao.ordering.SortBy._
import dao.ordering.{Page, SortBy}
import controllers.api.ResultMaker._
import dao.{SqlDatabase, SqlExecutionContext}
import util.ApiOps._
import util.EitherD._
import play.api.libs.json._
import play.api.mvc._
import services.TransactionService
import services.ErrorService._
import slick.jdbc.PostgresProfile.api._

import scalaz._

/**
  * Transaction REST resource controller
  */
class TransactionController @Inject() (protected val sql: SqlDatabase, protected val ts: TransactionService)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  val DEFAULT_PAGE_SIZE = 10

  /**
    * Tries to convert Json data to TransactionWrapperDTO
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
    val tx = ts
      .prepareTransactionDto(None, parseDto(request.body))
      .map(_.map(ts.add))
      .transform

    val result = tx.run.flatMap(x => handleErrors(x)(createResult))
    sql.query(result)
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

    val result =
      ts
        .list(filterObj, ordering, page)
        .map { x =>
          val (transactions, count) = x
          makeResult(transactions, count)(OK)
        }
    sql.query(result)
  }

  /**
    * Transaction object retrieval method
    * @param id transaction id.
    * @return transaction object.
    */
  def show(id: Long) = Action.async {
    val result = ts.get(id).flatMap {
      case None => makeErrorResult("TRANSACTION_NOT_FOUND")
      case Some(x) => DBIO.successful(makeResult(x)(OK))
    }
    sql.query(result)
  }

  /**
    * Replaces transaction with new one.
    *
    * @return newly created transaction (with id) wrapped to JSON.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val tx = ts.prepareTransactionDto(Some(id),
                                                      parseDto(request.body))
    val result = tx.flatMap {
      case -\/(e) => makeErrorResult(e) //Fail fast
      case \/-(dto) =>
        ts
          .replace(id, dto)
          .flatMap(x =>
            handleErrors(x) { tx =>
              makeResult(tx)(ACCEPTED)
          });
    }
    sql.query(result)
  }

  /**
    * Transaction object deletion method
    *
    * @param id transaction to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    val result = ts
      .delete(id)
      .flatMap(x =>
        handleErrors(x) { _ =>
          NoContent
      })
    sql.query(result)
  }
}
