package services

import BigDecimal.RoundingMode.HALF_EVEN
import dao.filters.AccountFilter
import models._
import util.EitherOps._
import validators.Validator._
import controllers.dto.AccountDTO
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.AccountQuery
import javax.inject.Inject
import scalaz._
import Scalaz._

import scala.concurrent._

/**
  * Account operations service.
  */
class AccountService @Inject() (protected val rs: RateService, protected val sql: SqlDatabase)
                                   (implicit ec: SqlExecutionContext) {

  private def getAssetPropertyForAccountDto(validDto: \/[String, AccountDTO]) = {
    val assetAccountProperty = validDto.map(d => d.account_type match {
      case AssetAccount => Some(dtoToAssetAccountProperty(d))
      case _ => None
    }).toOption.flatten
    assetAccountProperty
  }

  def accountToDto(account: Account): ErrorF[AccountDTO] = {
    rs.getCurrentRateToPrimary(account.currency_id)
        .map(_.rate * account.balance)
        .map(_.setScale(2, HALF_EVEN))
        .flatMap { primary_balance =>
          val properties = sql.query(AccountQuery.findPropertyById(account.id.get))
          val propValue = properties.map(_.map(p => (p.operational, p.favorite, Some(p.asset_type))).getOrElse(false, false, Option.empty[AssetType]))
          val dto:Future[\/[String, AccountDTO]] = propValue.map(pv =>
            AccountDTO(
              account.id,
              account.account_type,
              pv._3,
              account.currency_id,
              account.name,
              account.balance,
              primary_balance,
              operational = pv._1,
              favorite = pv._2,
              hidden = account.hidden).right
          )
          EitherT(dto)
      }
  }

  def dtoToAccount(dto: AccountDTO): Account = Account(id = dto.id,
    account_type = dto.account_type,
    currency_id = dto.currency_id,
    name = dto.name,
    balance = dto.balance,
    hidden = dto.hidden)

  def dtoToAssetAccountProperty(dto: AccountDTO): AssetAccountProperty = AssetAccountProperty(
    id = dto.id,
    operational = dto.operational,
    favorite = dto.favorite,
    asset_type = dto.asset_type.getOrElse(CurrentAssetAccount)
  )

  /**
    * Creates Account or reports error.
    * @param dto Account to create, if exists.
    * @return Xor with errors or newly created account.
    */
  def create(dto: Option[AccountDTO]): ErrorF[AccountDTO] = {
    val validDto = dto
      .fromOption("ACCOUNT_DATA_INVALID")
      .map(validate)
      .flatMap(validationToXor)

    val query = getAssetPropertyForAccountDto(validDto).map(p => AccountQuery.insertWithProperties(p) _).getOrElse(AccountQuery.insert _)

    validDto.map(dtoToAccount)
      .map(query)
      .map(sql.query)
      .transform
      .flatMap(accountToDto)
  }

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
    * @param dto Account to edit
    * @return Update account or error
    */
  def edit(id: Long,
           dto: Option[AccountDTO]): ErrorF[AccountDTO] = {
    val validDto = dto.fromOption("ACCOUNT_DATA_INVALID")
      .map(validate)
      .flatMap(validationToXor)

    val newAcc = EitherT(Future.successful(validDto))
      .flatMap(ad => {getAccount(id).map(_.copy(name = ad.name, hidden = ad.hidden))})

    val query = getAssetPropertyForAccountDto(validDto)
      .map(_.copy(id = Some(id)))
      .map(p => AccountQuery.updateWithProperties(p) _)
      .getOrElse(AccountQuery.update _)

    newAcc
      .map(query(_).map(_.fromOption("ACCOUNT_NOT_UPDATED")))
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
