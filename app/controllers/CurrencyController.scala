package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao.SqlExecutionContext
import play.api.mvc._
import services.{CurrencyService, ErrorService}

/**
  * Currency resource REST controller
  */
@Singleton
class CurrencyController @Inject() (protected val es: ErrorService, protected val cs: CurrencyService)
                                   (implicit ec: SqlExecutionContext)
    extends InjectedController {

  /**
    * Currency list access method
    *
    * @return list of currencies on system, wrapped to json.
    */
  def index = Action.async {
    cs.list().map(x => makeResult(x)(OK))
  }

  /**
    * Currency object retrieval method
    *
    * @param id currency id.
    * @return currency object.
    */
  def show(id: Long) = Action.async {
    cs.get(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { x => makeResult(x)(OK) })
  }

  /**
    * Currency object modification method
    *
    * @param id currency id.
    * @return account object.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val a = (request.body \ "data" \ "attributes" \ "active").asOpt[Boolean]

    cs.edit(id, a).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }

}
