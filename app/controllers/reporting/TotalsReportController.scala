package controllers.reporting

import javax.inject._
import controllers.api.ResultMaker._
import dao._
import play.api.mvc._
import reports.TotalsReport

/**
  * TotalsReport resource REST controller
  */
@Singleton
class TotalsReportController @Inject() (protected val trs: TotalsReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * TotalsReport access method
    *
    * @return TotalsReport wrapped to Json
    */
  def index = Action.async {
    trs.get().map(x => makeResult(x)(OK))
  }
}
