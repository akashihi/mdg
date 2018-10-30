package controllers

import javax.inject._
import controllers.api.ResultMaker._
import controllers.dto.AccountDTO
import dao.SqlExecutionContext
import dao.filters.AccountFilter
import models.{Account, AccountType}
import play.api.libs.json._
import play.api.mvc._
import services.{AccountService, ErrorService}

/**
  * Account Resource REST controller.
  */
@Singleton
class AccountController @Inject()(protected val as: AccountService, protected val es: ErrorService)
                                 (implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Makes Play result form Account
    *
    * @param acc account data
    * @return Wrapped to json data of created account.
    */
  def createResult(acc: AccountDTO): Result =
    makeResult(acc)(CREATED)
      .withHeaders("Location" -> s"/api/account/${acc.id}")

  /**
    * Adds new account to the system.
    *
    * @return newly created account (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    val dto = request.body.validate[AccountDTO].asOpt

    as.create(dto)
      .run
      .flatMap(x => es.handleErrors(x)(createResult))
  }

  /**
    * Account list access method
    *
    * @return list of accounts on system, wrapped to json.
    */
  def index(filter: Option[String]) = Action.async {
    val accountFilter = filter
      .flatMap { x =>
        Json.parse(x).validate[AccountFilter].asOpt
      }
      .getOrElse(AccountFilter(None, None, None, None))
    as.list(accountFilter).map(x => makeResult(x)(OK))
  }

  /**
    * Account object retrieval method
    *
    * @param id currency id.
    * @return account object.
    */
  def show(id: Long) = Action.async {
    as.get(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { x => makeResult(x)(OK) })
  }

  /**
    * Account object modification method
    *
    * @param id currency id.
    * @return account object.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val dto = request.body.validate[AccountDTO].asOpt

    as.edit(id, dto).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }

  /**
    * Account object deletion method
    *
    * @param id account to delete
    * @return HTTP 204 in case of sucess, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    as.delete(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { _ => NoContent })
  }
}
