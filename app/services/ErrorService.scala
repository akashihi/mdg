package services

import javax.inject._

import dao.tables.Errors
import models.Error
import play.api.db.slick._
import play.api.mvc.Result
import play.api.mvc.Results._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import controllers.api.JsonWrapper._

import scala.concurrent._

/**
  * Error processing facility.
  */
class ErrorService @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
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

  def errorFor(code: String): Future[Result] = {
    db.run(getErrorFor(code))
      .map { x =>
        (x.status, wrapJson(x))
      }
      .map {
        case (status, x) =>
          status match {
            case "404" => NotFound(x)
            case "412" => PreconditionFailed(x)
            case "422" => UnprocessableEntity(x)
            case "500" => InternalServerError(x)
            case _ => InternalServerError(x)
          }
      }
  }
}
