package controllers
import controllers.api.ResultMaker.makeResult
import controllers.dto.CategoryDTO
import dao.SqlExecutionContext
import javax.inject.Inject
import play.api.mvc.{InjectedController, Result}
import services.{CategoryService, ErrorService}

class CategoryController @Inject()(protected val cs: CategoryService, protected val es: ErrorService)
                                  (implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Makes Play result from Category
    *
    * @param dto account data
    * @return Wrapped to json data of created account.
    */
  def createResult(dto: CategoryDTO): Result =
    makeResult(dto)(CREATED)
      .withHeaders("Location" -> s"/api/category/${ dto.id}")

  /**
    * Adds new account to the system.
    *
    * @return newly created account (with id) wrapped to JSON.
    */
  def create = Action.async(parse.tolerantJson) { request =>
    val dto = request.body.validate[CategoryDTO].asOpt

    cs.create(dto)
      .run
      .flatMap(x => es.handleErrors(x)(createResult))
  }

  /**
    * Account list access method
    *
    * @return list of accounts on system, wrapped to json.
    */
  def index() = Action.async {
    cs.list.map(x => makeResult(x)(OK))
  }

  /**
    * Account object retrieval method
    *
    * @param id currency id.
    * @return account object.
    */
  def show(id: Long) = Action.async {
    cs.get(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { x => makeResult(x)(OK) })
  }

  /**
    * Account object modification method
    *
    * @param id currency id.
    * @return account object.
    */
  def edit(id: Long) = Action.async(parse.tolerantJson) { request =>
    val dto = request.body.validate[CategoryDTO].asOpt

    cs.edit(id, dto).run.flatMap { x =>
      es.handleErrors(x) { x =>
        makeResult(x)(ACCEPTED)
      }
    }
  }

  /**
    * Account object deletion method
    *
    * @param id account to delete
    * @return HTTP 204 in case of sucess, HTTP error otherwise
    */
  def delete(id: Long) = Action.async {
    cs.delete(id)
      .run
      .flatMap(x =>
        es.handleErrors(x) { _ => NoContent })
  }
}
