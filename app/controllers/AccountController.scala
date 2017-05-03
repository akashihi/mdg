package controllers

import javax.inject._

import controllers.api.ResultMaker._
import dao.AccountDao
import dao.filters.AccountFilter
import models.{Account, AccountType}
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc._
import services.ErrorService
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

/**
  * Account Resource REST controller.
  */
@Singleton
class AccountController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider,
    protected val errors: ErrorService)(implicit ec: ExecutionContext)
    extends Controller {
  val db = dbConfigProvider.get[JdbcProfile].db

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
    } yield Account(Some(0), AccountType(t), c, n, b, hidden = false)

    val result = account match {
      case Some(x) =>
        AccountDao.insert(x).map { r =>
          makeResult(r)(CREATED)
            .withHeaders("Location" -> s"/api/account/${r.id}")
        }
      case None => ErrorService.getErrorFor("ACCOUNT_DATA_INVALID").map(x => makeResult(x))
    }
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
    val result = AccountDao.findById(id).flatMap {
      case None =>
        ErrorService.getErrorFor("ACCOUNT_NOT_FOUND").map(x => makeResult(x))
      case Some(x) => DBIO.successful(makeResult(x)(OK))
    }
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
    val result = AccountDao.findById(id).flatMap {
      case None =>
        ErrorService.getErrorFor("ACCOUNT_NOT_FOUND").map(x => makeResult(x))
      case Some(x) =>
        AccountDao
          .update(
            x.copy(name = n.getOrElse(x.name), hidden = h.getOrElse(x.hidden)))
          .flatMap {
            case None =>
              ErrorService
                .getErrorFor("ACCOUNT_NOT_UPDATED")
                .map(x => makeResult(x))
            case Some(r) => DBIO.successful(makeResult(r)(ACCEPTED))
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
    val result = AccountDao.delete(id).flatMap {
      case Some(_) => DBIO.successful(NoContent)
      case None =>
        ErrorService.getErrorFor("ACCOUNT_NOT_FOUND").map(x => makeResult(x))
    }
    db.run(result)
  }
}
