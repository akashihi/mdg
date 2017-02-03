package controllers

import javax.inject._

import controllers.JsonWrapper._
import dao.AccountDao
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

  def create = Action.async(parse.tolerantJson) { request =>
    val account = for {
      n <- (request.body \ "data" \ "attributes" \ "name").asOpt[String]
      t <- (request.body \ "data" \ "attributes" \ "account_type").asOpt[String]
      c <- (request.body \ "data" \ "attributes" \ "currency_id").asOpt[Long]
      b <- (request.body \ "data" \ "attributes" \ "balance").asOpt[BigDecimal] match {
        case Some(x) => Some(x)
        case None => Some[BigDecimal](0)
      }
    } yield Account(0, AccountType(t), c, n, b, hidden = false)

    account match {
      case Some(x) => dao.insert(x).map {
        r => Created(Json.toJson(wrapJson(r))).as("application/vnd.mdg+json")
      }
      case None => errors.errorFor("ACCOUNT_DATA_INVALID")
    }
  }
}
