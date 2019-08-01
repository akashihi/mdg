package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao.SqlExecutionContext
import play.api.mvc._
import services.{ErrorService, SettingService}

/**
  * Setting resource REST controller
  */
@Singleton
class SettingController @Inject() (protected val ss: SettingService, protected val es: ErrorService)
                                  (implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Setting list access method
    *
    * @return list of settings on system, wrapped to json.
    */
  def index = Action.async {
    ss.list().map(x => makeResult(x)(OK))
  }

  /**
    * Setting object retrieval method
    *
    * @param id setting id.
    * @return setting object.
    */
  def show(id: String) = Action.async {
    ss
      .get(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { x =>
          makeResult(x)(OK)
      })
  }

  /**
    * currency.primary setting method.
    *
    * @return setting object.
    */
  def editCurrencyPrimary() = Action.async(parse.tolerantJson) { request =>
    val value = (request.body \ "data" \ "attributes" \ "value").asOpt[String]

    ss.setCurrencyPrimary(value).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }

  /**
    * ui.transaction.closedialog setting method.
    *
    * @return setting object.
    */
  def editUiTransactionCloseDialog() = Action.async(parse.tolerantJson) { request =>
    val value = (request.body \ "data" \ "attributes" \ "value").asOpt[String]

    ss.setUiTransactionCloseDialog(value).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }

  /**
    * ui.language setting method.
    *
    * @return setting object.
    */
  def editUiLanguage() = Action.async(parse.tolerantJson) { request =>
    val value = (request.body \ "data" \ "attributes" \ "value").asOpt[String]

    ss.setUiLanguage(value).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }
}
