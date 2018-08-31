package controllers

import javax.inject.Inject

import controllers.api.JsonWrapper._
import controllers.api.ResultMaker._
import play.api.mvc._
import services.BudgetEntryService
import services.ErrorService._
import util.ApiOps._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

/**
  * Budget REST resource controller.
  */
class BudgetEntryController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext)
    extends InjectedController {
  val db = dbConfigProvider.get[JdbcProfile].db

  def index(budget_id: Long) = Action.async {
    val result = BudgetEntryService.list(budget_id).map(x => Ok(wrapJson(x)))
    db.run(result)
  }

  /**
    * BudgetEntry object retrieval method
    * @param id budgetentry id.
    * @return budgetentry wrapper object.
    */
  def show(id: Long, budget_id: Long) = Action.async {
    val result = BudgetEntryService.find(id, budget_id).flatMap {
      case None => makeErrorResult("BUDGETENTRY_NOT_FOUND")
      case Some(x) => DBIO.successful(Ok(wrapJson(x)))
    }
    db.run(result)
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

      val result = BudgetEntryService.edit(id, budget_id, e, p, a).flatMap {
        x =>
          handleErrors(x) { x =>
            makeResult(x)(ACCEPTED)
          }
      }

      db.run(result)
  }
}
