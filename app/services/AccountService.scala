package services

import BigDecimal.RoundingMode.HALF_EVEN
import dao.filters.AccountFilter
import models.{Account, AssetAccount, ExpenseAccount, IncomeAccount}
import play.api.libs.concurrent.Execution.Implicits._
import slick.jdbc.PostgresProfile.api._
import util.EitherD
import util.EitherD._
import validators.Validator._
import scalaz._
import controllers.dto.AccountDTO
import dao.queries.AccountQuery

/**
  * Account operations service.
  */
object AccountService {

  def accountToDto(account: Account): EitherD[String, AccountDTO] = {
    RateService.getCurrentRateToPrimary(account.currency_id)
        .map(_.rate * account.balance)
        .map(_.setScale(2, HALF_EVEN))
        .map { primary_balance =>
      AccountDTO(
        account.id,
        account.account_type,
        account.currency_id,
        account.name,
        account.balance,
        primary_balance,
        account.operational,
        account.favorite,
        account.hidden
      )
    }
  }

  /**
    * Creates Account or reports error.
    * @param account Account to create, if exists.
    * @return Xor with errors or newly created account.
    */
  def create(account: Option[Account]): EitherD[String, AccountDTO] =
    account
      .fromOption("ACCOUNT_DATA_INVALID")
      .map(validate)
      .flatMap(validationToXor)
      .map(AccountQuery.insert)
      .transform
      .map(accountToDto)
      .flatten

  def list(filter: AccountFilter): DBIO[Seq[AccountDTO]] =
    AccountQuery.list(filter)
      .flatMap(s => DBIO.sequence(s.map(a => accountToDto(a).run.filter(_.isRight).map{case \/-(r) => r})))

  /**
    * Retrieves acocunts matching filter and returns them
    * separated on account type.
    * @param filter Filter to apply.
    * @return tuple of three sequences (income accounts, asset accounts, expense accounts)
    */
  def listSeparate(filter: AccountFilter)
    : DBIO[(Seq[Account], Seq[Account], Seq[Account])] = {
    AccountQuery.list(filter).map { a =>
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
  def getAccount(id: Long): EitherD[String, Account] =
    EitherD(AccountQuery.findById(id).map(_.fromOption("ACCOUNT_NOT_FOUND")))

  /**
    * Retrieves account by id or returns error
    * @param id Account id to retrieve
    * @return AccountDTO XOR error
    */
  def get(id: Long): EitherD[String, AccountDTO] =
    getAccount(id).map(accountToDto).flatten

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
           hidden: Option[Boolean]): EitherD[String, AccountDTO] = {
    val newAcc = AccountService
      .getAccount(id)
      .map(acc =>
        acc.copy(
          name = name.getOrElse(acc.name),
          hidden = hidden.getOrElse(acc.hidden),
          operational = operational.getOrElse(acc.operational),
          favorite = favorite.getOrElse(acc.favorite)
      ))
      .map(validate)
      .map(validationToXor)
      .flatMap(identity)

    newAcc
      .map(acc =>
        AccountQuery.update(acc).map(_.fromOption("ACCOUNT_NOT_UPDATED")))
      .map(x => EitherD(x))
      .flatten
      .map(accountToDto)
      .flatten
  }

  /**
    * Removes account.
    *
    * @param id identificator of account to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    AccountQuery.delete(id).map(_.fromOption("ACCOUNT_NOT_FOUND"))
  }
}
