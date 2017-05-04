package util

import controllers.api.ResultMaker._
import play.api.mvc.Result
import services.ErrorService
import slick.dbio.DBIO

/**
  * Api helper functions.
  */
object ApiOps {
  import play.api.libs.concurrent.Execution.Implicits._

  /**
    * Converts error, specified by code, to the Play result object.
    * @param error code of error.
    * @return Play's result wrapped to DBIO.
    */
  def makeErrorResult(error: String): DBIO[Result] =
    ErrorService.getErrorFor(error).map(x => makeResult(x))
}
