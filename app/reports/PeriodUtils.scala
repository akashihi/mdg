package reports
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object PeriodUtils {
  /**
    * Takes period of two dates and granularity
    * and generated list of days between those two days
    * with specified granularity.
    * @param start First date of the period (inclusive)
    * @param end Last date of the period (inclusive)
    * @param granularity quantity of days between two dates
    * @return A sorted array of dates between start and end, filled
    *         with days, that have granularity days between them.
    */
  def expandPeriod(start: LocalDate,
                           end: LocalDate,
                           granularity: Int) = {
    val numberOfDays = ChronoUnit.DAYS.between(start, end) / granularity
    val daysGenerated = for (f <- 0L to numberOfDays)
      yield start.plusDays(f * granularity)
    val days = daysGenerated.:+(end)
    days
  }
}
