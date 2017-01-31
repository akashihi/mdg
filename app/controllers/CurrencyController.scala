package controllers

import javax.inject._

import controllers.JsonWrapper._
import dao.CurrencyDao
import play.api.libs.json._
import play.api.mvc._
import services.ErrorService

import scala.concurrent.{ExecutionContext, Future}

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject()(protected val dao: CurrencyDao, protected val errors: ErrorService)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Currency list access method
    *
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    dao.list().map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }

  def show(id: Long) = Action.async {
    dao.findById(id).flatMap {
      case None => errors.errorFor("CURRENCY_NOT_FOUND")
      case Some(x) => Future(Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
    }
  }
}
