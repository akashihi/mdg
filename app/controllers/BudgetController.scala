package controllers

import java.time._
import javax.inject.Inject

import controllers.JsonWrapper._
import controllers.dto.{BudgetDTO, BudgetOutgoingAmount}
import models.Budget
import play.api.mvc._
import services.{BudgetService, ErrorService, TransactionService}
import play.api.libs.json._

import scala.concurrent._

/**
  * Budget REST resource controller.
  */
class BudgetController @Inject()(protected val budgetService: BudgetService,
                                 errors: ErrorService)(implicit ec: ExecutionContext)extends Controller {

  /**
    * Adds new budget to the system.
    *
    * @return newly created budget (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    implicit def dateToBudgetId(d: LocalDate): Long = {
      d.getYear*10000 + d.getMonthValue*100 + d.getDayOfMonth
    }

    val budget = for {
      b <- (request.body \ "data" \ "attributes" \ "term_beginning").asOpt[LocalDate]
      e <- (request.body \ "data" \ "attributes" \ "term_end").asOpt[LocalDate]
    } yield Budget(Some(b), b, e)

    budget match {
      case Some(x) => {
        if ( x.term_beginning > x.term_end ) {
          errors.errorFor("BUDGET_INVALID_TERM")
        } else {
          if ( Period.between(x.term_beginning, x.term_end).getDays <= 1 ) {
            errors.errorFor("BUDGET_SHORT_RANGE")
          } else {
            budgetService.add(x).map{ x =>
              Created(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json").withHeaders("Location" -> s"/api/budget/${x.id.get}")
            }
          }
        }
      }
      case None => errors.errorFor("BUDGET_DATA_INVALID")
    }
  }

  def index = Action.async {
    budgetService.list().map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }
}
