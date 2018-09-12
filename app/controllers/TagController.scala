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
class TagController @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext)
    extends InjectedController with HasDatabaseConfigProvider[JdbcProfile] {

  /**
    * Tag list access method
    *
    * @return list of tags on system, wrapped to json.
    */
  def index = Action.async {
    db.run(TagQuery.list().map(x => makeResult(x)(OK)))
  }
}
