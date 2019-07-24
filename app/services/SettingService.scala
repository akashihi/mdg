package services

import com.google.common.cache.{CacheBuilder, CacheLoader}
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.{CurrencyQuery, SettingQuery}
import javax.inject.Inject
import models.Setting
import util.OptionConverters._
import util.EitherOps._
import scalaz._
import Scalaz._

import scala.concurrent._

/**
  * Setting operations service.
  */
sealed trait SettingName { def name: String }
case object PrimaryCurrency extends SettingName {val name = "currency.primary" }
case object UiTransactionCloseDialog extends SettingName {val name = "ui.transaction.closedialog" }
case object UiLanguage extends SettingName {val name = "ui.language" }

class SettingService @Inject()(protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {

  private val settingLoader = new CacheLoader[String, ErrorF[Setting]] {
    override def load(key: String): ErrorF[Setting] =
      EitherT(sql.query(SettingQuery.findById(key)).map(_.fromOption("SETTING_NOT_FOUND")))
  }
  implicit val settingsCache = CacheBuilder.newBuilder().build(settingLoader)

  /**
    * Lists entries for specified budget.
    *
    * @return Sequence of BudgetEntry DTOs.
    */
  def list(): Future[Seq[Setting]] = sql.query(SettingQuery.list())

  /**
    * Retrieves setting by name or returns error
    *
    * @param id Setting name
    * @return Setting XOR error
    */
  def get(id: String): ErrorF[Setting] = settingsCache.get(id)
  def get(id: SettingName): ErrorF[Setting] = settingsCache.get(id.name)

  def setCurrencyPrimary(value: Option[String]): ErrorF[Setting] = {
    val curOption = value
      .flatMap(_.tryToLong)
      .fromOption("SETTING_DATA_INVALID")
      .map(CurrencyQuery.findById)
      .map(sql.query)
      .transform

    val haveCurrency =
      curOption.map(_.fromOption("SETTING_DATA_INVALID")).flatMapF(Future.successful)

    val setting = getSetting(haveCurrency, PrimaryCurrency)
    updateSetting(setting, PrimaryCurrency, value)
  }

  def setUiTransactionCloseDialog(value: Option[String]): ErrorF[Setting] = {
    val option = value.flatMap(_.tryToBool)

    val setting = getSetting(option, UiTransactionCloseDialog)
    updateSetting(setting, UiTransactionCloseDialog, value)
  }

  def setUiLanguage(value: Option[String]): ErrorF[Setting] = {
    val setting = getSetting(value, UiLanguage)

    updateSetting(setting, UiLanguage, value)
  }

  protected def getSetting[T](i: Option[T], setting: SettingName): ErrorF[Setting] = {
    val option = EitherT(Future.successful(i.fromOption("SETTING_DATA_INVALID")))
    getSetting(option, setting)
  }


  protected def getSetting[T](i: ErrorF[T], setting: SettingName): ErrorF[Setting] =
    i.map(_ => SettingQuery.findById(setting.name))
      .map(sql.query)
      .map(OptionT.apply)
      .flatMapF(_.fromOption("SETTING_NOT_FOUND"))

  protected def updateSetting(setting: ErrorF[Setting], name: SettingName, value: Option[String]): ErrorF[Setting] = {
    val savedSetting = setting.map(s => s.copy(value = value.getOrElse(s.value)))
      .map(SettingQuery.update)
      .map(sql.query)

    settingsCache.invalidate(name.name)

    savedSetting.map(OptionT.apply).flatMapF(_.fromOption("SETTING_NOT_UPDATED"))
  }
}
