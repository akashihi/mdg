package services

import javax.inject._

import dao.tables.Errors
import models.Error
import models.Error.errorWrites
import play.api.db.slick._
import play.api.mvc.Result
import play.api.mvc.Results._
import play.api.libs.json._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

/**
  * Error processing facility.
  */
class ErrorService @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val errors = TableQuery[Errors]

  case class ErrorWrapper(errors: Seq[Error])

  implicit val errorWrapperWrites = Json.writes[ErrorWrapper]

  def errorFor(code: String): Future[Result] = {
    db.run(errors.filter(_.code === code).result.headOption).map {
      case None => Error(code, "500", "Unknown error occurred", Some("This error code have no description in the database"))
      case Some(x) => x
    }
      .map { x => (x.status, Json.toJson(ErrorWrapper(Seq(x)))) }
      .map { case (status, x) =>
        status match {
          case "404" => NotFound(x).as("application/vnd.mdg+json")
          case "412" => PreconditionFailed(x).as("application/vnd.mdg+json")
          case "422" => UnprocessableEntity(x).as("application/vnd.mdg+json")
          case "500" => InternalServerError(x).as("application/vnd.mdg+json")
          case _ => InternalServerError(x).as("application/vnd.mdg+json")
        }
      }
  }
}
