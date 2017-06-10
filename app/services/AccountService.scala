package services

import dao.AccountDao
import models.Account
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.Validator._

import scalaz._
import Scalaz._

/**
  * Account operations service.
  */
object AccountService {

  /**
    * Creates Account or reports error.
    * @param account Account to create, if exists.
    * @return Xor with errors or newly created account.
    */
  def create(account: Option[Account]): \/[String, DBIO[Account]] = {
    (account match {
      case None => "ACCOUNT_DATA_INVALID".left
      case Some(x) => x.right
    }).map(validate)
      .flatMap(validationToXor)
      .map(AccountDao.insert)
  }

  /**
    * Retrieves account by id or returns error
    * @param id Account id to retrieve
    * @return Account XOR error
    */
  def get(id: Long): DBIO[\/[String, Account]] = {
    AccountDao.findById(id).map {
      case None => "ACCOUNT_NOT_FOUND".left
      case Some(x) => x.right
    }
  }

  /**
    * Changes values of specified account.
    * @param id Account id to edit
    * @param name new 'name' value
    * @param operational new 'operational' value
    * @param favorite new 'favorite' value
    * @param hidden new 'hidden' value
    * @return Update account or error
    */
  def edit(id: Long,
           name: Option[String],
           operational: Option[Boolean],
           favorite: Option[Boolean],
           hidden: Option[Boolean]): DBIO[\/[String, Account]] = {
    val newAcc = AccountService
      .get(id)
      .map(
        acc =>
          acc
            .map(x =>
              x.copy(
                name = name.getOrElse(x.name),
                hidden = hidden.getOrElse(x.hidden),
                operational = operational.getOrElse(x.operational),
                favorite = favorite.getOrElse(x.favorite)
            ))
            .map(validate)
            .map(validationToXor)
            .flatMap(identity)
      )

    newAcc.flatMap {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(a) =>
        AccountDao.update(a).flatMap {
          case None => DBIO.successful("ACCOUNT_NOT_UPDATED".left)
          case Some(x) => DBIO.successful(x.right)
        }
    }
  }

  /**
    * Removes account.
    *
    * @param id identificator of account to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    AccountDao.delete(id).map {
      case Some(_) => 1.right
      case None => "ACCOUNT_NOT_FOUND".left
    }
  }
}
