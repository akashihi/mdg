package services

import dao.queries.CurrencyQuery
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import models.Currency
import util.EitherOps._

import scala.concurrent.Future

import scalaz._
import Scalaz._

/**
  * Currencies operations service.
  */
class CurrencyService @Inject() (protected val sql: SqlDatabase)
                                (implicit ec: SqlExecutionContext) {

  def list(): Future[Seq[Currency]] = sql.query(CurrencyQuery.list())

  def get(id: Long): ErrorF[Currency] = EitherT(sql.query(CurrencyQuery.findById(id)).map(_.fromOption("CURRENCY_NOT_FOUND")))

  /**
    * Changes values of specified currency.
    * @param id Account id to edit.
    * @param active new 'active' value.
    * @return Updated currency or error.
    */
  def edit(id: Long,
           active: Option[Boolean]): ErrorF[Currency] = {
    val newCurrency = this
      .get(id)
      .map(cur => cur.copy(active = active.getOrElse(cur.active)))

    newCurrency
      .map(acc =>
        CurrencyQuery.update(acc).map(_.fromOption("ACCOUNT_NOT_UPDATED")))
      .flatMapF(sql.query)
  }

}
