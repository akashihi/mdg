package services

import com.google.common.cache.{CacheBuilder, CacheLoader}
import dao.{CurrencyDao, SettingDao}
import models.Setting
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.OptionConverters._
import util.EitherD._
import util.EitherD

import scalaz._

/**
  * Setting operations service.
  */
object SettingService {

  val PrimaryCurrency = "currency.primary"

  val settingLoader = new CacheLoader[String, EitherD[String, Setting]] {
    override def load(key: String): EitherD[String, Setting] =
      EitherD(SettingDao.findById(key).map(_.fromOption("SETTING_NOT_FOUND")))
  }
  implicit val settingsCache = CacheBuilder.newBuilder().build(settingLoader)

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
  def get(id: String): EitherD[String, Setting] = settingsCache.get(id)

  def setCurrencyPrimary(value: Option[String]): EitherD[String, Setting] = {
    val curOption = value
      .flatMap(_.tryToLong)
      .fromOption("SETTING_DATA_INVALID")
      .map(CurrencyDao.findById)
    val haveCurrency =
      curOption.transform.flatMap(_.fromOption("SETTING_DATA_INVALID"))

    val setting = haveCurrency.map(
      _ =>
        SettingDao
          .findById(PrimaryCurrency)
          .map(_.fromOption("SETTING_NOT_FOUND")))

    val savedSetting = setting
      .map(o => EitherD(o))
      .flatten
      .map(s => s.copy(value = value.getOrElse(s.value)))
      .map(s => SettingDao.update(s))

    settingsCache.invalidate(PrimaryCurrency)

    savedSetting
      .map(_.map(_.fromOption("SETTING_NOT_UPDATED")))
      .map(o => EitherD(o))
      .flatten
  }
}
