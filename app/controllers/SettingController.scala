package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao.{SqlDatabase, SqlExecutionContext}
import play.api.db.slick._
import play.api.mvc._
import services.SettingService
import services.ErrorService._
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Setting resource REST controller
  */
@Singleton
class SettingController @Inject() (protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Setting list access method
    *
    * @return list of settings on system, wrapped to json.
    */
  def index = Action.async {
    sql.query(SettingService.list().map(x => makeResult(x)(OK)))
  }

  /**
    * Setting object retrieval method
    *
    * @param id setting id.
    * @return setting object.
    */
  def show(id: String) = Action.async {
    val result = SettingService
      .get(id)
      .run
      .flatMap(x =>
        handleErrors(x) { x =>
          makeResult(x)(OK)
      })
    sql.query(result)
  }

  /**
    * currency.primary setting method.
    *
    * @return setting object.
    */
  def editCurrencyPrimary() = Action.async(parse.tolerantJson) { request =>
    val value = (request.body \ "data" \ "attributes" \ "value").asOpt[String]

    val result = SettingService.setCurrencyPrimary(value).run.flatMap { x =>
      handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
    sql.query(result)
  }

  /**
    * ui.transaction.closedialog setting method.
    *
    * @return setting object.
    */
  def editUiTransactionCloseDialog() = Action.async(parse.tolerantJson) { request =>
    val value = (request.body \ "data" \ "attributes" \ "value").asOpt[String]

    val result = SettingService.setUiTransactionCloseDialog(value).run.flatMap { x =>
      handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
    sql.query(result)
  }
}
