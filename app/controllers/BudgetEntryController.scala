package controllers

import javax.inject.Inject

import controllers.api.JsonWrapper._
import play.api.mvc._
import services.{BudgetEntryService, ErrorService}

import scala.concurrent.{ExecutionContext, Future}

/**
  * Budget REST resource controller.
  */
class BudgetEntryController @Inject()(
    private val budgetEntryService: BudgetEntryService,
    private val errors: ErrorService)(implicit ec: ExecutionContext)
    extends Controller {

  def index(budget_id: Long) = Action.async {
    budgetEntryService.list(budget_id).map(x => Ok(wrapJson(x)))
  }

  /**
    * BudgetEntry object retrieval method
    * @param id budgetentry id.
    * @return budgetentry wrapper object.
    */
  def show(id: Long, budget_id: Long) = Action.async {
    budgetEntryService.find(id, budget_id).flatMap {
      case None => errors.errorFor("BUDGETENTRY_NOT_FOUND")
      case Some(x) => Future(Ok(wrapJson(x)))
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
      budgetEntryService.edit(id, budget_id, e, p, a).flatMap {
        case Right(error) => errors.errorFor(error)
        case Left(entry) =>
          entry.map { x =>
            Accepted(wrapJson(x))
          }
      }
  }

}
