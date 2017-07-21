package controllers.api

import scalaz._
import slick.driver.PostgresDriver.api._
import play.api.mvc._
import util.ApiOps._
import play.api.libs.concurrent.Execution.Implicits._

object ErrorHandler {

  /**
    * Takes pair of possible processing error or processing result
    * and wraps them to the Play Result.
    * @param resultWrapper container containg error XOR result wrapped to DBIO
    * @param op operation to be applied to the result.
    * @tparam T Type of the result
    * @return Play Result object
    */
  def handleErrors[T](resultWrapper: => \/[String, T])(
      op: T => Result): DBIO[Result] = {
    resultWrapper match {
      case \/-(x) => DBIO.successful(op(x))
      case -\/(e) => makeErrorResult(e)
    }
  }
}
