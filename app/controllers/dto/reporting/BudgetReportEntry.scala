package controllers.dto.reporting

import java.time.LocalDate
import play.api.libs.json._

import controllers.dto.BudgetPair
import controllers.dto.BudgetDTO.budgetPairWrites //Used implicitly by Json.writes below

case class BudgetReportEntry(date: LocalDate, income: BudgetPair, expense: BudgetPair, profit: BigDecimal) extends ReportValue;

object BudgetReportEntry {
  implicit val budgetReportEntryWrite = Json.writes[BudgetReportEntry]
}
