package controllers

import javax.inject._

import controllers.api.ResultMaker._
import dao.AccountDao
import dao.filters.AccountFilter
import models.{Account, AccountType}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc._
import services.AccountService
import services.ErrorService._
import slick.driver.JdbcProfile

import scala.concurrent._

/**
  * Account Resource REST controller.
  */
@Singleton
class AccountController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext)
    extends Controller {

  val db = dbConfigProvider.get[JdbcProfile].db

  /**
    * Makes Play result form Account
    *
    * @param acc account data
    * @return Wrapped to json data of created account.
    */
  def createResult(acc: Account): Result =
    makeResult(acc)(CREATED)
      .withHeaders("Location" -> s"/api/account/${acc.id}")

  /**
    * Adds new account to the system.
    *
    * @return newly created account (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    val account = for {
      n <- (request.body \ "data" \ "attributes" \ "name").asOpt[String]
      t <- (request.body \ "data" \ "attributes" \ "account_type")
        .asOpt[String]
      c <- (request.body \ "data" \ "attributes" \ "currency_id").asOpt[Long]
      b <- (request.body \ "data" \ "attributes" \ "balance")
        .asOpt[BigDecimal] match {
        case Some(x) => Some(x)
        case None => Some[BigDecimal](0)
      }
      f = (request.body \ "data" \ "attributes" \ "favorite")
        .asOpt[Boolean]
        .getOrElse(false)
      o = (request.body \ "data" \ "attributes" \ "operational")
        .asOpt[Boolean]
        .getOrElse(false)
    } yield Account(Some(0), AccountType(t), c, n, b, f, o, hidden = false)

    val result = AccountService
      .create(account)
      .run
      .flatMap(x => handleErrors(x)(createResult))
    db.run(result)
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
      .getOrElse(AccountFilter(None, None, None))
    val result = AccountDao.list(accountFilter).map(x => makeResult(x)(OK))
    db.run(result)
  }

  /**
    * Account object retrieval method
    *
    * @param id currency id.
    * @return account object.
    */
  def show(id: Long) = Action.async {
    val result = AccountService
      .get(id)
      .flatMap(x =>
        handleErrors(x) { x =>
          makeResult(x)(OK)
      })
    db.run(result)
  }

  /**
    * Account object modification method
    *
    * @param id currency id.
    * @return account object.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val n = (request.body \ "data" \ "attributes" \ "name").asOpt[String]
    val h = (request.body \ "data" \ "attributes" \ "hidden").asOpt[Boolean]
    val f = (request.body \ "data" \ "attributes" \ "favorite")
      .asOpt[Boolean]
    val o = (request.body \ "data" \ "attributes" \ "operational")
      .asOpt[Boolean]

    val result = AccountService.edit(id, n, o, f, h).flatMap { x =>
      handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }

    db.run(result)
  }

  /**
    * Account object deletion method
    *
    * @param id account to delete
    * @return HTTP 204 in case of sucess, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    val result = AccountService
      .delete(id)
      .flatMap(x =>
        handleErrors(x) { _ =>
          NoContent
      })
    db.run(result)
  }
}
