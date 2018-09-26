package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.CurrencyQuery
import play.api.mvc._
import services.ErrorService

import scala.concurrent._

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject() (protected val es: ErrorService, protected val sql: SqlDatabase)
                                   (implicit ec: SqlExecutionContext)
    extends InjectedController {

  /**
    * Currency list access method
    *
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    sql.query(CurrencyQuery.list().map(x => makeResult(x)(OK)))
  }

  /**
    * Currency object retrieval method
    *
    * @param id currency id.
    * @return currency object.
    */
  def show(id: Long) = Action.async {
    sql.query(CurrencyQuery.findById(id)).flatMap {
      case Some(x) => Future.successful(makeResult(x)(OK))
      case None => es.makeErrorResult("CURRENCY_NOT_FOUND")
    }
  }
}
