package services

import controllers.api.ResultMaker.makeResult
import dao.{SqlDatabase, SqlExecutionContext}
import dao.tables.Errors
import javax.inject.Inject
import models.Error
import slick.jdbc.PostgresProfile.api._
import play.api.mvc.Result
import scalaz._

import scala.concurrent._

/**
  * Error processing facility.
  */
class ErrorService @Inject() (protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {
  private val errors = TableQuery[Errors]

  /**
    * Takes pair of possible processing error or processing result
    * and wraps them to the Play Result.
    * @param resultWrapper container contaning error XOR result wrapped to DBIO
    * @param op operation to be applied to the result.
    * @tparam T Type of the result
    * @return Play Result object
    */
  def handleErrors[T](resultWrapper: => \/[String, T])(op: T => Result): Future[Result] =
    resultWrapper match {
      case \/-(x) => Future.successful(op(x))
      case -\/(e) => makeErrorResult(e)
    }

  /**
    * Converts error, specified by code, to the Play result object.
    * @param error code of error.
    * @return Play's result wrapped to DBIO.
    */
  def makeErrorResult(error: String): Future[Result] = {
    val defaultError = Error(error, "500", "Unknown error occurred", Some("This error code have no description in the database"))
    val query = errors.filter(_.code === error).result.headOption
    sql.query(query).map(_.getOrElse(defaultError)).map(makeResult)
  }


}
