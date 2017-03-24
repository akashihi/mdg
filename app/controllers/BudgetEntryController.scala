package controllers

import javax.inject.Inject

import controllers.JsonWrapper._
import play.api.libs.json.Json
import play.api.mvc._
import services.{BudgetEntryService, ErrorService}

import scala.concurrent.ExecutionContext

/**
  * Budget REST resource controller.
  */
class BudgetEntryController @Inject()(private val budgetEntryService: BudgetEntryService,
                                      private val errors: ErrorService)(implicit ec: ExecutionContext)extends Controller {

  def index(budget_id: Long) = Action.async {
    budgetEntryService.list(budget_id).map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }
}
