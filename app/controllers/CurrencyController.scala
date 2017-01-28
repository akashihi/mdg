package controllers

import javax.inject._

import models.Currency
import play.api.libs.json._
import play.api.mvc._
import controllers.JsonWrapper._

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject() extends Controller {

  /**
    * Currency list access method
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action {
    Ok(Json.toJson(wrapJson(List(Currency(978, "EUR", "€"))))).as("application/vnd.mdg+json")
  }
}
