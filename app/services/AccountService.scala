package services

import BigDecimal.RoundingMode.HALF_EVEN
import dao.filters.AccountFilter
import models.{Account, AssetAccount, ExpenseAccount, IncomeAccount}
import util.EitherD._
import validators.Validator._
import scalaz._
import controllers.dto.AccountDTO
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.AccountQuery
import javax.inject.Inject

import scala.concurrent._

/**
  * Account operations service.
  */
class AccountService @Inject() (protected val rs: RateService, protected val sql: SqlDatabase)
                                   (implicit ec: SqlExecutionContext) {

  def accountToDto(account: Account): ErrorF[AccountDTO] = {
    rs.getCurrentRateToPrimary(account.currency_id)
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
  def create(account: Option[Account]): ErrorF[AccountDTO] =
    account
      .fromOption("ACCOUNT_DATA_INVALID")
      .map(validate)
      .flatMap(validationToXor)
      .map(AccountQuery.insert)
      .map(sql.query)
      .transform
      .flatMap(accountToDto)

  def list(filter: AccountFilter): Future[Seq[AccountDTO]] =
    sql.query(AccountQuery.list(filter))
      .flatMap(s => Future.sequence(s.map(a => accountToDto(a).run.filter(_.isRight).map{case \/-(r) => r})))

  /**
    * Retrieves accounts matching filter and returns them
    * separated on account type.
    * @param filter Filter to apply.
    * @return tuple of three sequences (income accounts, asset accounts, expense accounts)
    */
  def listSeparate(filter: AccountFilter)
    : Future[(Seq[Account], Seq[Account], Seq[Account])] = {
    val query = AccountQuery.list(filter).map { a =>
      val incomeAccounts =
        a.filter(_.account_type == IncomeAccount)
      val assetAccounts =
        a.filter(_.account_type == AssetAccount)
      val expenseAccounts =
        a.filter(_.account_type == ExpenseAccount)

      (incomeAccounts, assetAccounts, expenseAccounts)
    }
    sql.query(query)
  }

  /**
    * Retrieves account by id or returns error
    * @param id Account id to retrieve
    * @return Account XOR error
    */
  def getAccount(id: Long): ErrorF[Account] =
    EitherT(sql.query(AccountQuery.findById(id)).map(_.fromOption("ACCOUNT_NOT_FOUND")))

  /**
    * Retrieves account by id or returns error
    * @param id Account id to retrieve
    * @return AccountDTO XOR error
    */
  def get(id: Long): ErrorF[AccountDTO] =
    getAccount(id).flatMap(accountToDto)

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
           hidden: Option[Boolean]): ErrorF[AccountDTO] = {
    val newAcc = this
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
      .flatMapF(Future.successful)

    newAcc
      .map(acc =>
        AccountQuery.update(acc).map(_.fromOption("ACCOUNT_NOT_UPDATED")))
      .flatMapF(sql.query)
      .flatMap(accountToDto)
  }

  /**
    * Removes account.
    *
    * @param id identificator of account to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): ErrorF[Int] = {
    EitherT(sql.query(AccountQuery.delete(id).map(_.fromOption("ACCOUNT_NOT_FOUND"))))
  }
}
