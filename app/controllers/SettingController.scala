package controllers

import javax.inject._

import controllers.api.ResultMaker._
import dao._
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._
import util.ApiOps._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent.ExecutionContext

/**
  * Setting resource REST controller
  */
@Singleton
class SettingController @Inject()(
                                    protected val dbConfigProvider: DatabaseConfigProvider)(
                                    implicit ec: ExecutionContext)
  extends Controller {
  val db = dbConfigProvider.get[JdbcProfile].db

  /**
    * Setting list access method
    *
    * @return list of settings on system, wrapped to json.
    */
  def index = Action.async {
    db.run(SettingDao.list().map(x => makeResult(x)(OK)))
  }

  /**
    * Setting object retrieval method
    *
    * @param id setting id.
    * @return setting object.
    */
  def show(id: String) = Action.async {
    val result = SettingDao.findById(id).flatMap {
      case Some(x) => DBIO.successful(makeResult(x)(OK))
      case None => makeErrorResult("SETTING_NOT_FOUND")
    }
    db.run(result)
  }
}
