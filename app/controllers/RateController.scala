package controllers

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import javax.inject.{Inject, Singleton}
import controllers.api.ResultMaker._
import dao.SqlExecutionContext
import play.api.mvc._
import services.RateService

/**
  * Rate resource REST controller
  */
@Singleton
class RateController @Inject() (protected val rs: RateService)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Rate list access method.
    *
    * @param ts Point in time in format of 'YYYY-MM-DDTHH:MM:SS'.
    * @return list of currency rates valid at ts, wrapped to json.
    */
  def index(ts: String) = Action.async {
      rs.list(LocalDateTime.parse(ts, DateTimeFormatter.ISO_LOCAL_DATE_TIME))
        .map(x => makeResult(x)(OK))
  }

  /**
    * Setting object retrieval method.
    *
    * @param ts Point in time in format of 'YYYY-MM-DDTHH:MM:SS'.
    * @param from Id of currency that you would like to sell.
    * @param to Id of currency that you would like to buy.
    * @return setting object.
    */
  def show(ts: String, from: Long, to: Long) = Action.async {
      rs.get(LocalDateTime.parse(ts, DateTimeFormatter.ISO_LOCAL_DATE_TIME),
             from,
             to)
        .map(x => makeResult(x)(OK))
  }
}
