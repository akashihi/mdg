package services
import java.time.LocalDateTime

import controllers.dto.{AccountDTO, OperationDto, TransactionDto}
import models._
import org.scalamock.scalatest.MockFactory
import tests.ParameterizedSpec

import scala.concurrent.Future

class TransactionServiceTest extends ParameterizedSpec with MockFactory {
  property("Transactions are rebalanced correctly on account currency change") {
    val as = mock[AccountService]
    val rateService= mock[RateService]

    val accounts = Array(
      AccountDTO(Some(1L), IncomeAccount, None, 978, None, "EUR", 0, 0, false, false, false),
      AccountDTO(Some(2L), ExpenseAccount, None, 840, None, "USD", 0, 0, false, false, false),
      AccountDTO(Some(3L), AssetAccount, None, 203, None, "CZK", 0, 0, false, false, false)
    )

    (as.list _).expects(*).returning(Future.successful(accounts))
    (rateService.get _).expects(*, 978, 978).anyNumberOfTimes().returning(Future.successful(Rate(None, LocalDateTime.now(), LocalDateTime.now(), 978, 978, 1)))

    val ts = new TransactionService(rateService, null, as, null, null)(null)

    val ops = Seq(
      OperationDto(1L, 100, Some(25)),
      OperationDto(3L, 2500, Some(1))
    )

    val tx = TransactionDto(None, LocalDateTime.now(), None, operations = ops)

    val actual = ts.txReplaceAccCurrency(tx, Account(Some(3L), AssetAccount, 978, None, "CZK", 0, false))
    val actualOp = actual.operations.filter(_.account_id == 3L).head
    actualOp.rate should be (Some(1))
    actualOp.amount should be (100)
  }

}
