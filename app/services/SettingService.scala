package services

import dao.{CurrencyDao, SettingDao}
import models.Setting
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.EitherD
import util.OptionConverters._
import util.EitherD._

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
      case None => "SETTING_NOT_FOUND".left
      case Some(x) => x.right
    }
  }

  def setCurrencyPrimary(value: Option[String]): EitherD[String, Setting] = {
    val curOption = value
      .flatMap(_.tryToLong)
      .map(_.right)
      .getOrElse("SETTING_DATA_INVALID".left)
      .map(CurrencyDao.findById)
    val haveCurrency = curOption.transform.flatMap(_.map(_.right).getOrElse("SETTING_DATA_INVALID".left))

    val setting = haveCurrency.map(_ => SettingDao.findById("currency.primary").map(_.map(_.right).getOrElse("SETTING_NOT_FOUND".left)))

    val savedSetting = setting.map(o => EitherD(o)).flatten
      .map(s => s.copy(value = value.getOrElse(s.value)))
      .map(s => SettingDao.update(s))

    savedSetting.map(_.map(_.map(_.right).getOrElse("ACCOUNT_NOT_UPDATED".left))).map(o => EitherD(o)).flatten
  }
}
