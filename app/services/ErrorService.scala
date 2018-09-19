package services

import controllers.api.ResultMaker.makeResult
import dao.{SqlDatabase, SqlExecutionContext}
import dao.tables.Errors
import javax.inject.Inject
import models.Error
import slick.jdbc.PostgresProfile.api._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.Result
import util.ApiOps._
import scalaz._

import scala.concurrent._

/**
  * Error processing facility.
  */
class ErrorService @Inject() (protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {
  /**
    * Takes pair of possible processing error or processing result
    * and wraps them to the Play Result.
    * @param resultWrapper container contaning error XOR result wrapped to DBIO
    * @param op operation to be applied to the result.
    * @tparam T Type of the result
    * @return Play Result object
    */
  def handleErrors[T](resultWrapper: => \/[String, T])(op: T => Result): Future[Result] =
    sql.query(ErrorService.handleErrors(resultWrapper)(op))

  /**
    * Converts error, specified by code, to the Play result object.
    * @param error code of error.
    * @return Play's result wrapped to DBIO.
    */
  def makeErrorResult(error: String): Future[Result] =
    sql.query(ErrorService.getErrorFor(error).map(x => makeResult(x)))

}
object ErrorService {
  val errors = TableQuery[Errors]

  /**
    * Constructs an API error object for the specified code.
    * @param code error code
    * @return Error object for specified code or general error if not found.
    */
  def getErrorFor(code: String): DBIO[Error] = {
    errors
      .filter(_.code === code)
      .result
      .headOption
      .map {
        case Some(x) => x
        case None =>
          Error(code,
                "500",
                "Unknown error occurred",
                Some("This error code have no description in the database"))
      }
  }

  /**
    * Takes pair of possible processing error or processing result
    * and wraps them to the Play Result.
    * @param resultWrapper container contaning error XOR result wrapped to DBIO
    * @param op operation to be applied to the result.
    * @tparam T Type of the result
    * @return Play Result object
    */
  def handleErrors[T](resultWrapper: => \/[String, T])(op: T => Result): DBIO[Result] = {
    resultWrapper match {
      case \/-(x) => DBIO.successful(op(x))
      case -\/(e) => makeErrorResult(e)
    }
  }
}
