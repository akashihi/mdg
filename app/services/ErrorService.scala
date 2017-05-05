package services

import javax.inject._

import controllers.api.ResultMaker._
import dao.tables.Errors
import models.Error
import play.api.db.slick._
import play.api.mvc.Result
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

/**
  * Error processing facility.
  */
class ErrorService @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val errors = ErrorService.errors

  def errorFor(code: String): Future[Result] = {
    db.run(ErrorService.getErrorFor(code)).map { x =>
      makeResult(x)
    }
  }
}

object ErrorService {
  import play.api.libs.concurrent.Execution.Implicits._

  val errors = TableQuery[Errors]

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
}
