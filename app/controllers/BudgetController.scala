package controllers

import java.time._

import javax.inject.Inject
import controllers.api.ResultMaker._
import models.Budget
import play.api.mvc._
import services.{BudgetService, ErrorService}
import slick.jdbc.PostgresProfile.api._
import _root_.util.ApiOps._
import controllers.dto.BudgetDTO
import dao.SqlExecutionContext

import scala.concurrent._

/**
  * Budget REST resource controller.
  */
class BudgetController @Inject()(protected val bs: BudgetService, protected val es: ErrorService)
                                (implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Makes Play result form Budget(DTO)
    *
    * @param b budget data
    * @return Wrapped to json data of created budget.
    */
  def createResult(b: BudgetDTO): Result =
    makeResult(b)(CREATED)
      .withHeaders("Location" -> s"/api/budget/${b.id.get}")

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

    bs.add(budget).run.flatMap(x => es.handleErrors(x)(createResult))
  }

  def index = Action.async {
    bs.list().map(x => makeResult(x)(OK))
  }

  /**
    * Budget object retrieval method
    * @param id budget id.
    * @return budget wrapper object.
    */
  def show(id: Long) = Action.async {
    bs.get(id).run.flatMap {
      case None => es.makeErrorResult("BUDGET_NOT_FOUND")
      case Some(x) => Future.successful(makeResult(x)(OK))
    }
  }

  /**
    * Budget object deletion method
    *
    * @param id budget to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    bs.delete(id).run
      .flatMap(x =>
        es.handleErrors(x) { _ => NoContent })
  }
}
