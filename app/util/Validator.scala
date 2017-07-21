package util

import java.time.temporal.ChronoUnit

import controllers.dto.TransactionDto
import models.{Account, AssetAccount, Budget}

import scalaz.Scalaz._
import scalaz._

object Validator {
  type StringValidation[T] = ValidationNel[String, T]

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
  def validate(account: Account): StringValidation[Account] = {
    def validateOpsFlag(account: Account): StringValidation[Account] = {
      if (account.operational && account.account_type != AssetAccount) {
        "ACCOUNT_NONASSET_INVALIDFLAG".failureNel
      } else { account.success }
    }

    def validateFavFlag(account: Account): StringValidation[Account] = {
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
  def validate(tx: TransactionDto): StringValidation[TransactionDto] = {
    def transactionBalanced(
        tx: TransactionDto): StringValidation[TransactionDto] = {
      if (tx.operations.map(o => o.amount).sum != 0) {
        "TRANSACTION_NOT_BALANCED".failureNel
      } else { tx.success }
    }

    def transactionNotEmpty(
        tx: TransactionDto): StringValidation[TransactionDto] = {
      if (!tx.operations.exists(o => o.amount != 0)) {
        "TRANSACTION_EMPTY".failureNel
      } else { tx.success }
    }

    (transactionBalanced(tx)
      |@| transactionNotEmpty(tx)) { case _ => tx }
  }

  /**
    * Checks Budget for validity.
    * Valid budget should start before own end
    * and should be at least one day long.
    */
  def validate(b: Budget): StringValidation[Budget] = {
    def budgetPeriodNotInverted(b: Budget): StringValidation[Budget] = {
      if (b.term_beginning isAfter b.term_end) {
        "BUDGET_INVALID_TERM".failureNel
      } else {
        b.success
      }
    }

    def budgetPeriodNotShort(b: Budget): StringValidation[Budget] = {
      if (ChronoUnit.DAYS.between(b.term_beginning, b.term_end) < 1) {
        "BUDGET_SHORT_RANGE".failureNel
      } else {
        b.success
      }
    }

    (budgetPeriodNotInverted(b) |@| budgetPeriodNotShort(b)) { case _ => b }
  }
}
