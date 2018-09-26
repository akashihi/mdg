package controllers

import javax.inject._
import controllers.api.ResultMaker._
import dao._
import dao.queries.TagQuery
import play.api.db.slick._
import play.api.mvc._
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Tag resource REST controller
  */
@Singleton
class TagController @Inject() (protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * Tag list access method
    *
    * @return list of tags on system, wrapped to json.
    */
  def index = Action.async {
    sql.query(TagQuery.list().map(x => makeResult(x)(OK)))
  }
}
