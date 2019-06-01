package reports

import java.time.LocalDate

import controllers.dto.BudgetPair
import controllers.dto.reporting.{BudgetReportEntry, GenericReportDTO}
import dao.queries.{AssetQuery, BudgetQuery}
import dao.{SqlDatabase, SqlExecutionContext}
import dao.reporting.BudgetReportQuery
import javax.inject.Inject
import models.{ExpenseAccount, IncomeAccount}

import scala.concurrent.Future

class BudgetReport @Inject() (protected val sql: SqlDatabase)
                            (implicit ec: SqlExecutionContext) {
  def getExecution(start: LocalDate, end: LocalDate): Future[GenericReportDTO[BudgetReportEntry]] = {
    val incomes = sql.query(BudgetReportQuery.getTotalByTypeForBudgets(IncomeAccount, start, end)).map(_.map(i => (i._1, -1 * i._2))).map(_.toMap)
    val expenses = sql.query(BudgetReportQuery.getTotalByTypeForBudgets(ExpenseAccount, start, end)).map(_.toMap)

    val expectedIncomes = sql.query(BudgetReportQuery.getExpectedByTypeForBudgets(IncomeAccount, start, end)).map(_.toMap)
    val expectedExpenses = sql.query(BudgetReportQuery.getExpectedByTypeForBudgets(ExpenseAccount, start, end)).map(_.toMap)

    val profits = sql.query(BudgetQuery.findBudgetsInRange(start, end)).map(_.map(b => (b.term_beginning, b.term_end))
      .map(t => (t._1, sql.query(AssetQuery.getTotalAssetsForDate(t._1)), sql.query(AssetQuery.getTotalAssetsForDate(t._2))))
      .map(p => (p._1, p._2 zip p._3))
      .map(p => (Future.successful(p._1), p._2.map(a => a._2 - a._1)))
      .map(p => p._1 zip p._2))
      .flatMap(s => Future.sequence(s))
      .map(_.toMap)

    val entries = for {
      i <- incomes
      ei <- expectedIncomes
      e <- expenses
      ee <- expectedExpenses
      p <- profits
    } yield i.map(inc => BudgetReportEntry(inc._1, BudgetPair(ei.getOrElse(inc._1, 0), inc._2), BudgetPair(ee.getOrElse(inc._1, 0), e.getOrElse(inc._1, 0)), p.getOrElse(inc._1, 0)))

    val sortedEntries = entries.map(_.toSeq.sortWith((l, r) => l.date.isAfter(r.date)))
    sortedEntries.map(GenericReportDTO(Some("budget_execution"), _))
  }
}
