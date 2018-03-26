package controllers

import java.time._
import javax.inject.Inject

import controllers.api.ResultMaker._
import models.Budget
import play.api.mvc._
import services.BudgetService
import services.ErrorService._
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._
import _root_.util.ApiOps._
import controllers.dto.BudgetDTO

/**
  * Budget REST resource controller.
  */
class BudgetController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext)
    extends Controller {

  val db = dbConfigProvider.get[JdbcProfile].db

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

    val result =
      BudgetService.add(budget).run.flatMap(x => handleErrors(x)(createResult))
    db.run(result)
  }

  def index = Action.async {
    val result = BudgetService.list().map(x => makeResult(x)(OK))
    db.run(result)
  }

  /**
    * Budget object retrieval method
    * @param id budget id.
    * @return budget wrapper object.
    */
  def show(id: Long) = Action.async {
    val result = BudgetService.get(id).flatMap {
      case None => makeErrorResult("BUDGET_NOT_FOUND")
      case Some(x) => DBIO.successful(makeResult(x)(OK))
    }
    db.run(result)
  }

  /**
    * Budget object deletion method
    *
    * @param id budget to delete
    * @return HTTP 204 in case of success, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    val result = BudgetService
      .delete(id)
      .flatMap(x =>
        handleErrors(x) { _ =>
          NoContent
      })
    db.run(result)
  }
}
