package services
import java.time.LocalDateTime

import controllers.dto.{AccountDTO, OperationDto, TransactionDto}
import models._
import org.scalamock.scalatest.MockFactory
import tests.ParameterizedSpec
import com.sksamuel.elastic4s.http.ElasticDsl._
import dao.SqlExecutionContext

import scala.concurrent.Future

class TransactionServiceTest extends ParameterizedSpec with MockFactory {
  val system = akka.actor.ActorSystem("system")
  val ec = new SqlExecutionContext(system)
  val as = mock[AccountService]
  val rs= mock[RateService]

  val accounts = Array(
    AccountDTO(Some(1L), IncomeAccount, None, 978, None, "EUR", 0, 0, false, false, false),
    AccountDTO(Some(2L), ExpenseAccount, None, 840, None, "USD", 0, 0, false, false, false),
    AccountDTO(Some(3L), AssetAccount, None, 203, None, "CZK", 0, 0, false, false, false)
  )

  property("Transactions with same currency rebalanced precisely") {
    (as.list _).expects(*).returning(Future.successful(accounts))
    (rs.get _).expects(*, 978, 978).anyNumberOfTimes().returning(Future.successful(Rate(None, LocalDateTime.now(), LocalDateTime.now(), 978, 978, 1)))

    val ts = new TransactionService(rs, null, as, null, null)(ec)

    val ops = Seq(
      OperationDto(1L, 100, Some(25)),
      OperationDto(3L, 2500, Some(1))
    )

    val tx = TransactionDto(None, LocalDateTime.now(), None, operations = ops)

    val actual = ts.txReplaceAccCurrency(tx, Account(Some(3L), AssetAccount, 978, None, "CZK", 0, false)).await
    val actualOp = actual.operations.filter(_.account_id == 3L).head

    actualOp.rate should be (Some(1))
    actualOp.amount should be (100)
  }

  property("Transactions with default currency rebalanced correctly") {
    (as.list _).expects(*).returning(Future.successful(accounts))
    (rs.get _).expects(*, 203, 203).anyNumberOfTimes().returning(Future.successful(Rate(None, LocalDateTime.now(), LocalDateTime.now(), 203, 203, 1)))

    val ts = new TransactionService(rs, null, as, null, null)(ec)

    val ops = Seq(
      OperationDto(1L, 100, Some(25)),
      OperationDto(3L, 2500, Some(1))
    )

    val tx = TransactionDto(None, LocalDateTime.now(), None, operations = ops)

    val actual = ts.txReplaceAccCurrency(tx, Account(Some(1L), AssetAccount, 203, None, "CZK", 0, false)).await
    val actualOp = actual.operations.filter(_.account_id == 1L).head

    actualOp.rate should be (Some(1))
    actualOp.amount should be (2500)
  }

  property("Transactions with several currencies have rate recalculated") {
    (as.list _).expects(*).returning(Future.successful(accounts))
    (rs.get _).expects(*, 978, 978).anyNumberOfTimes().returning(Future.successful(Rate(None, LocalDateTime.now(), LocalDateTime.now(), 978, 978, 1)))
    (rs.get _).expects(*, 840, 978).anyNumberOfTimes().returning(Future.successful(Rate(None, LocalDateTime.now(), LocalDateTime.now(), 840, 978, 0.8)))

    val ts = new TransactionService(rs, null, as, null, null)(ec)

    val ops = Seq(
      OperationDto(1L, 100, Some(25)),
      OperationDto(2L, 100, Some(20)),
      OperationDto(3L, 4500, Some(1))
    )

    val tx = TransactionDto(None, LocalDateTime.now(), None, operations = ops)

    val actual = ts.txReplaceAccCurrency(tx, Account(Some(3L), AssetAccount, 978, None, "CZK", 0, false)).await
    val actualOp = actual.operations.filter(_.account_id == 3L).head

    actualOp.rate should be (Some(1))
    actualOp.amount should be (180)

    val eurOp = actual.operations.filter(_.account_id == 1L).head

    eurOp.rate should be (Some(1))
    eurOp.amount should be (100)

    val usdOp = actual.operations.filter(_.account_id == 2L).head
    
    usdOp.rate should be (Some(0.8))
    usdOp.amount should be (100)
  }
}
