package controllers

import java.time._
import javax.inject.Inject

import controllers.api.JsonWrapper._
import models.Budget
import play.api.mvc._
import services.{BudgetService, ErrorService}

import scala.concurrent._

/**
  * Budget REST resource controller.
  */
class BudgetController @Inject()(
    protected val budgetService: BudgetService,
    errors: ErrorService)(implicit ec: ExecutionContext)
    extends Controller {

  /**
    * Adds new budget to the system.
    *
    * @return newly created budget (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    implicit def dateToBudgetId(d: LocalDate): Long = {
      d.getYear * 10000 + d.getMonthValue * 100 + d.getDayOfMonth
    }

    val budget = for {
      b <- (request.body \ "data" \ "attributes" \ "term_beginning")
        .asOpt[LocalDate]
      e <- (request.body \ "data" \ "attributes" \ "term_end").asOpt[LocalDate]
    } yield Budget(Some(b), b, e)

    budgetService.add(budget) match {
      case Left(b) =>
        b map { x =>
          Created(wrapJson(x))
            .withHeaders("Location" -> s"/api/budget/${x.id.get}")
        }
      case Right(msg) => errors.errorFor(msg)
    }
  }

  def index = Action.async {
    budgetService.list().map(x => Ok(wrapJson(x)))
  }

  /**
    * Budget object retrieval method
    * @param id budget id.
    * @return budget wrapper object.
    */
  def show(id: Long) = Action.async {
    budgetService.find(id).flatMap {
      case None => errors.errorFor("BUDGET_NOT_FOUND")
      case Some(x) => Future(Ok(wrapJson(x)))
    }
  }

  /**
    * Budget object deletion method
    *
    * @param id budget to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    budgetService.delete(id).flatMap {
      case Some(_) => Future(NoContent)
      case None => errors.errorFor("BUDGET_NOT_FOUND")
    }
  }
}
