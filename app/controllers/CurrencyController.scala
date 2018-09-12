package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao._
import dao.queries.CurrencyQuery
import play.api.db.slick._
import play.api.mvc._
import util.ApiOps._
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext)
    extends InjectedController with HasDatabaseConfigProvider[JdbcProfile] {

  /**
    * Currency list access method
    *
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    db.run(CurrencyQuery.list().map(x => makeResult(x)(OK)))
  }

  /**
    * Currency object retrieval method
    *
    * @param id currency id.
    * @return currency object.
    */
  def show(id: Long) = Action.async {
    val result = CurrencyQuery.findById(id).flatMap {
      case Some(x) => DBIO.successful(makeResult(x)(OK))
      case None => makeErrorResult("CURRENCY_NOT_FOUND")
    }
    db.run(result)
  }
}
