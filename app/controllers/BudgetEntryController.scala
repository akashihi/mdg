package controllers

import javax.inject.Inject
import controllers.api.JsonWrapper._
import controllers.api.ResultMaker._
import dao.SqlExecutionContext
import play.api.mvc._
import services.{BudgetEntryService, ErrorService}

import scala.concurrent._

/**
  * Budget REST resource controller.
  */
class BudgetEntryController @Inject() (protected val bes: BudgetEntryService, protected val es: ErrorService)
                                      (implicit ec: SqlExecutionContext)
  extends InjectedController {

  def index(budget_id: Long) = Action.async {
    bes.list(budget_id).map(x => Ok(wrapJson(x)))
  }

  /**
    * BudgetEntry object retrieval method
    * @param id budgetentry id.
    * @return budgetentry wrapper object.
    */
  def show(id: Long, budget_id: Long) = Action.async {
    bes.find(id, budget_id).run.flatMap {
      case None => es.makeErrorResult("BUDGETENTRY_NOT_FOUND")
      case Some(x) => Future.successful(Ok(wrapJson(x)))
    }
  }

  /**
    * Budget entry object modification method
    *
    * @param id budget entry id.
    * @return budget entry wrapper object.
    */
  def edit(id: Long, budget_id: Long) = Action.async(parse.tolerantJson) {
    request =>
      val e = (request.body \ "data" \ "attributes" \ "even_distribution")
        .asOpt[Boolean]
      val p =
        (request.body \ "data" \ "attributes" \ "proration").asOpt[Boolean]
      val a = (request.body \ "data" \ "attributes" \ "expected_amount")
        .asOpt[BigDecimal]

      bes.edit(id, budget_id, e, p, a).run.flatMap { x => es.handleErrors(x) { x => makeResult(x)(ACCEPTED) } }
  }
}
