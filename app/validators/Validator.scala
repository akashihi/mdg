package validators

import java.time.temporal.ChronoUnit

import controllers.dto._
import models._

import scalaz.Scalaz._
import scalaz._

object Validator {
  type StringValidation[T] = ValidationNel[String, T]
  type AccountValidation = StringValidation[Account]
  type TransactionDTOValidation = StringValidation[TransactionDto]
  type BudgetValidation = StringValidation[Budget]

  def validationToXor[T](v: StringValidation[T]): \/[String, T] = {
    v match {
      case Failure(x) => x.head.left
      case Success(x) => x.right
    }
  }

  /**
    * Checks Account for validity
    * Valid Account should have ops/fav flags only on 'asset' account.
    *
    * @param account Account to process
    * @return List of errors or account object
    */
  def validate(account: Account): AccountValidation = {
    def validateOpsFlag(account: Account): AccountValidation = {
      if (account.operational && account.account_type != AssetAccount) {
        "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
      } else { account.success }
    }

    def validateFavFlag(account: Account): AccountValidation = {
      if (account.favorite && account.account_type != AssetAccount) {
        "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
      } else { account.success }
    }

    (validateOpsFlag(account)
      |@| validateFavFlag(account)) { case _ => account }
  }

  /**
    * Checks list of (DTO) operations for validity.
    * Valid list should have it's balance (sum of all amounts)
    * equal to zero and have at list one operation simultaneously.
    *
    * @param tx list to process.
    * @return List of errors or tx object
    */
  def validate(accounts: Seq[Account])(
      tx: TransactionDto): TransactionDTOValidation = {
    val accountCurrency = Map(accounts.map { a =>
      a.id.get -> a.currency_id
    }: _*)

    def transactionBalanced(tx: TransactionDto): TransactionDTOValidation = {
      val ratedOps = tx.operations.map(o => o.amount * o.rate.getOrElse(1))
      if (ratedOps.sum != 0) {
        "TRANSACTION_NOT_BALANCED".failureNel
      } else { tx.success }
    }

    def transactionNotEmpty(tx: TransactionDto): TransactionDTOValidation = {
      if (!tx.operations.exists(o => o.amount != 0)) {
        "TRANSACTION_EMPTY".failureNel
      } else { tx.success }
    }

    def transactionHaveRate(tx: TransactionDto): TransactionDTOValidation = {
      val currencyRates = tx.operations
        .map(o => o.account_id -> o.rate)
        .map(t => t.copy(_1 = accountCurrency(t._1)))
        .filter(t => t._2.isEmpty)
        .distinct

      if (currencyRates.size > 1) {
        "TRANSACTION_AMBIGUOUS_RATE".failureNel
      } else { tx.success }
    }

    def transactioNoZeroRate(tx: TransactionDto): TransactionDTOValidation = {
      val currencyRates = tx.operations
        .map(o => o.rate.getOrElse(1))
        .filter(_ == 0)

      if (currencyRates.nonEmpty) {
        "TRANSACTION_ZERO_RATE".failureNel
      } else { tx.success }
    }

    def transactionWithoutDefaultRate(
        tx: TransactionDto): TransactionDTOValidation = {
      val currencyRates = tx.operations
        .map(o => o.rate.getOrElse(1))
        .filter(_ == 1)

      if (currencyRates.isEmpty) {
        "TRANSACTION_NO_DEFAULT_RATE".failureNel
      } else { tx.success }
    }

    def transactionWithDoubleDefaultRate(
        tx: TransactionDto): TransactionDTOValidation = {
      val currencyRates = tx.operations
        .map(o => o.account_id -> o.rate.getOrElse(1))
        .map(t => t.copy(_1 = accountCurrency(t._1)))
        .filter(_._2 == 1)
        .map(_._1)
        .distinct

      if (currencyRates.size != 1) {
        "TRANSACTION_AMBIGUOUS_RATE".failureNel
      } else { tx.success }

    }

    (transactionNotEmpty(tx) |@| transactioNoZeroRate(tx) |@| transactionWithoutDefaultRate(
      tx) |@| transactionWithDoubleDefaultRate(tx) |@| transactionHaveRate(tx) |@| transactionBalanced(
      tx)) { case _ => tx }
  }

  /**
    * Checks Budget for validity.
    * Valid budget should start before own end
    * and should be at least one day long.
    */
  def validate(b: Budget): BudgetValidation = {
    def budgetPeriodNotInverted(b: Budget): BudgetValidation = {
      if (b.term_beginning isAfter b.term_end) {
        "BUDGET_INVALID_TERM".failureNel
      } else {
        b.success
      }
    }

    def budgetPeriodNotShort(b: Budget): BudgetValidation = {
      if (ChronoUnit.DAYS.between(b.term_beginning, b.term_end) < 1) {
        "BUDGET_SHORT_RANGE".failureNel
      } else {
        b.success
      }
    }

    (budgetPeriodNotInverted(b) |@| budgetPeriodNotShort(b)) { case _ => b }
  }
}
