package validators

import controllers.dto._
import models._

import scalaz.Scalaz._
import scalaz._

object Validator {
  type StringValidation[T] = ValidationNel[String, T]
  type AccountValidation = StringValidation[AccountDTO]
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
  def validate(account: AccountDTO): AccountValidation = {
    (AccountValidator.validateOpsFlag(account)
      |@| AccountValidator.validateFavFlag(account)
      |@| AccountValidator.validateAssetType(account)) { case _ => account }
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

    val v = new TransactionValidator(accounts)

    (v.transactionNotEmpty(tx) |@| v.transactioNoZeroRate(tx) |@| v
      .transactionWithoutDefaultRate(tx) |@| v
      .transactionWithDoubleDefaultRate(tx) |@| v.transactionHaveRate(tx) |@| v
      .transactionBalanced(tx)) { case _ => tx }
  }

  /**
    * Checks Budget for validity.
    * Valid budget should start before own end
    * and should be at least one day long.
    */
  def validate(b: Budget): BudgetValidation = {

    (BudgetValidator.budgetPeriodNotInverted(b) |@| BudgetValidator
      .budgetPeriodNotShort(b)) { case _ => b }
  }
}
