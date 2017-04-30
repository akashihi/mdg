package controllers

import javax.inject._

import controllers.api.JsonWrapper._
import dao._
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._
import services.ErrorService
import slick.driver.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider,
    protected val errors: ErrorService)(implicit ec: ExecutionContext)
    extends Controller {
  val db = dbConfigProvider.get[JdbcProfile].db

  /**
    * Currency list access method
    *
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    db.run(CurrencyDao.list()).map(x => Ok(wrapJson(x)))
  }

  /**
    * Currency object retrieval method
    *
    * @param id currency id.
    * @return currency object.
    */
  def show(id: Long) = Action.async {
    db.run(CurrencyDao.findById(id)).flatMap {
      case None => errors.errorFor("CURRENCY_NOT_FOUND")
      case Some(x) => Future(Ok(wrapJson(x)))
    }
  }
}
