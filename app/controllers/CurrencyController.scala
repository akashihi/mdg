package controllers

import javax.inject._

import controllers.api.JsonWrapper._
import dao.CurrencyDao
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
    dao.list().map(x => Ok(wrapJson(x)))
  }

  /**
    * Currency object retrieval method
    * @param id currency id.
    * @return currency object.
    */
  def show(id: Long) = Action.async {
    dao.findById(id).flatMap {
      case None => errors.errorFor("CURRENCY_NOT_FOUND")
      case Some(x) => Future(Ok(wrapJson(x)))
    }
  }
}
