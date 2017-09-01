package services

import dao.SettingDao
import models.Setting
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.ErrXor._
import util.Validator._

import scalaz._
import Scalaz._

/**
  * Setting operations service.
  */
object SettingService {

  /**
    * Lists entries for specified budget.
    * @return Sequence of BudgetEntry DTOs.
    */
  def list(): DBIO[Seq[Setting]] = SettingDao.list()

  /**
    * Retrieves setting by name or returns error
    * @param id Setting name
    * @return Setting XOR error
    */
  def get(id: String): DBIO[\/[String, Setting]] = {
    SettingDao.findById(id).map {
      case None => "ACCOUNT_NOT_FOUND".left
      case Some(x) => x.right
    }
  }
}
