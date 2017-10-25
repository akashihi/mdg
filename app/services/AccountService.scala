package services

import dao.AccountDao
import dao.filters.AccountFilter
import models.{Account, AssetAccount, ExpenseAccount, IncomeAccount}
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.EitherD
import util.EitherD._
import validators.Validator._

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
  def create(account: Option[Account]): EitherD[String, Account] = {

    account
      .fromOption("ACCOUNT_DATA_INVALID")
      .map(validate)
      .flatMap(validationToXor)
      .map(AccountDao.insert)
      .transform
  }

  /**
    * Retrieves acocunts matching filter and returns them
    * separated on account type.
    * @param filter Filter to apply.
    * @return tuple of three sequences (income accounts, asset accounts, expense accounts)
    */
  def listSeparate(filter: AccountFilter)
    : DBIO[(Seq[Account], Seq[Account], Seq[Account])] = {
    AccountDao.list(filter).map { a =>
      val incomeAccounts =
        a.filter(_.account_type == IncomeAccount)
      val assetAccounts =
        a.filter(_.account_type == AssetAccount)
      val expenseAccounts =
        a.filter(_.account_type == ExpenseAccount)

      (incomeAccounts, assetAccounts, expenseAccounts)
    }
  }

  /**
    * Retrieves account by id or returns error
    * @param id Account id to retrieve
    * @return Account XOR error
    */
  def get(id: Long): DBIO[\/[String, Account]] = {
    AccountDao.findById(id).map(_.fromOption("ACCOUNT_NOT_FOUND"))
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
    AccountDao.delete(id).map(_.fromOption("ACCOUNT_NOT_FOUND"))
  }
}
