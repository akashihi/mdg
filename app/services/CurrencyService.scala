package services

import dao.queries.CurrencyQuery
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import models.Currency
import util.EitherOps._

import scala.concurrent.Future

import scalaz._

/**
  * Currencies operations service.
  */
@Singleton
class CurrencyService @Inject() (protected val sql: SqlDatabase)
                                (implicit ec: SqlExecutionContext) {

  def list(): Future[Seq[Currency]] = sql.query(CurrencyQuery.list())

  def get(id: Long): ErrorF[Currency] = EitherT(sql.query(CurrencyQuery.findById(id)).map(_.fromOption("CURRENCY_NOT_FOUND")))
}
