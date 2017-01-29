package controllers

import javax.inject._

import models.Currency
import play.api.libs.json._
import play.api.mvc._
import controllers.JsonWrapper._
import dao.Currencies
import play.api.db.slick._
import slick.driver.PostgresDriver.api._
import slick.driver.JdbcProfile
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Currency list access method
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    val dbConfig = dbConfigProvider.get[JdbcProfile]
    val currencies = TableQuery[Currencies]
    dbConfig.db.run(currencies.result).map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }
}
