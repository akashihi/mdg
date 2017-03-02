package controllers

import java.time.LocalDate
import javax.inject.Inject

import controllers.JsonWrapper._
import models.{Budget, BudgetOutgoingAmount}
import play.api.mvc._
import services.ErrorService
import play.api.libs.json._

import scala.concurrent._

/**
  * Budget REST resource controller.
  */
class BudgetController @Inject()(val errors: ErrorService)(implicit ec: ExecutionContext)extends Controller {

  /**
    * Adds new budget to the system.
    *
    * @return newly created budget (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    Future(Created(Json.toJson(wrapJson(Budget(Some(20170205), LocalDate.of(2017, 2, 5), LocalDate.of(2017, 2, 6), 0, BudgetOutgoingAmount(0, 0))))).as("application/vnd.mdg+json").withHeaders("Location" -> s"/api/budget/20170205"))
  }
}
