package validators

import controllers.dto.TransactionDto
import models.Account
import Validator._

import scalaz.Scalaz._

/**
  * Created by dchaplyg on 10/25/17.
  */
class TransactionValidator(accounts: Seq[Account]) {
  val accountCurrency = Map(accounts.map { a =>
    a.id.get -> a.currency_id
  }: _*)

  def transactionBalanced(tx: TransactionDto): TransactionDTOValidation = {
    val haveRates = tx.operations.map(_.rate).exists(_.isDefined)
    val ratedOps = tx.operations.map(o => o.amount * o.rate.getOrElse(1)).sum
    if ((ratedOps != 0 && !haveRates) || !(-1 < ratedOps && ratedOps < 1)) {
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
}
