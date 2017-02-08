package controllers

import javax.inject._

import controllers.JsonWrapper._
import dao.AccountDao
import dao.filters.AccountFilter
import models.{Account, AccountType}
import play.api.libs.json._
import play.api.mvc._
import services.ErrorService

import scala.concurrent._

/**
  * Account Resource REST controller.
  */
@Singleton
class AccountController @Inject()(protected val dao: AccountDao, protected val errors: ErrorService)(implicit ec: ExecutionContext) extends Controller {

  /**
    * Adds new account to the system.
    *
    * @return newly created account (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    val account = for {
      n <- (request.body \ "data" \ "attributes" \ "name").asOpt[String]
      t <- (request.body \ "data" \ "attributes" \ "account_type").asOpt[String]
      c <- (request.body \ "data" \ "attributes" \ "currency_id").asOpt[Long]
      b <- (request.body \ "data" \ "attributes" \ "balance").asOpt[BigDecimal] match {
        case Some(x) => Some(x)
        case None => Some[BigDecimal](0)
      }
    } yield Account(Some(0), AccountType(t), c, n, b, hidden = false)

    account match {
      case Some(x) => dao.insert(x).map {
        r => Created(Json.toJson(wrapJson(r))).as("application/vnd.mdg+json").withHeaders("Location" -> s"/api/account/${r.id}")
      }
      case None => errors.errorFor("ACCOUNT_DATA_INVALID")
    }
  }

  /**
    * Account list access method
    *
    * @return list of accounts on system, wrapped to json.
    */
  def index(filter: Option[String]) = Action.async {
    dao.list(filter match {
      case Some(x) => Json.parse(x).validate[AccountFilter].asOpt.getOrElse(AccountFilter(None, None, None))
      case None => AccountFilter(None, None, None)
    }).map(x => Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
  }

  /**
    * Account object retrieval method
    *
    * @param id currency id.
    * @return account object.
    */
  def show(id: Long) = Action.async {
    dao.findById(id).flatMap {
      case None => errors.errorFor("ACCOUNT_NOT_FOUND")
      case Some(x) => Future(Ok(Json.toJson(wrapJson(x))).as("application/vnd.mdg+json"))
    }
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
    dao.findById(id).flatMap {
      case None => errors.errorFor("ACCOUNT_NOT_FOUND")
      case Some(x) => dao.update(x.copy(name = n.getOrElse(x.name), hidden = h.getOrElse(x.hidden))).flatMap {
        case None => errors.errorFor("ACCOUNT_NOT_UPDATED")
        case Some(r) => Future(Accepted(Json.toJson(wrapJson(r))).as("application/vnd.mdg+json"))
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
    dao.delete(id).flatMap {
      case Some(_) => Future(NoContent)
      case None => errors.errorFor("ACCOUNT_NOT_FOUND")
    }
  }
}
