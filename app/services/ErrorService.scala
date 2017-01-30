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
import scala.concurrent.duration._

import scala.concurrent._

/**
  * Created by Denis Chapligin on 30.01.2017.
  */
class ErrorService @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val errors = TableQuery[Errors]

  case class ErrorWrapper(errors: Seq[Error])

  implicit val errorWrapperWrites = Json.writes[ErrorWrapper]

  def errorFor(code: String): Result = {
    Await.result(db.run(errors.filter(_.code === code).result.headOption).map {
      case None => Error(code, "500", "Unknown error occurred", Some("This error code have no description in the database"))
      case Some(x) => x
    }
      .map { x:Error =>
        val json = Json.toJson(ErrorWrapper(Seq(x)))
        x.status match {
          case "404" => NotFound(json)
          case _ => InternalServerError(json)
        }
      }, 1000 millis)
  }
}
