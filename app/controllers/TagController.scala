package controllers

import javax.inject._

import controllers.api.ResultMaker._
import dao._
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Tag resource REST controller
  */
@Singleton
class TagController @Inject()(
                               protected val dbConfigProvider: DatabaseConfigProvider)(
                               implicit ec: ExecutionContext)
  extends Controller {
  val db = dbConfigProvider.get[JdbcProfile].db

  /**
    * Tag list access method
    *
    * @return list of tags on system, wrapped to json.
    */
  def index = Action.async {
    db.run(TagDao.list().map(x => makeResult(x)(OK)))
  }
}
