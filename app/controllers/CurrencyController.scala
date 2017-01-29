package controllers

import javax.inject._

import controllers.JsonWrapper._
import dao.CurrencyDao
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.ExecutionContext

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject()(protected val dao: CurrencyDao)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Currency list access method
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    dao.list().map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }

  def show(id:Long) = Action.async {
    dao.findById(id).map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }
}
