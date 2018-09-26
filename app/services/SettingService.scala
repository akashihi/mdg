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
class SettingService @Inject()(protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {

  val PrimaryCurrency = "currency.primary"
  val UiTransactionCloseDialog = "ui.transaction.closedialog"

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

  def setCurrencyPrimary(value: Option[String]): ErrorF[Setting] = {
    val curOption = value
      .flatMap(_.tryToLong)
      .fromOption("SETTING_DATA_INVALID")
      .map(CurrencyQuery.findById)
      .map(sql.query)
      .transform

    val haveCurrency =
      curOption.map(_.fromOption("SETTING_DATA_INVALID")).flatMapF(Future.successful)

    val setting = haveCurrency.map(_ => SettingQuery.findById(PrimaryCurrency))
      .map(sql.query)
      .map(OptionT.apply)
      .flatMapF(_.fromOption("SETTING_NOT_FOUND"))

    updateSetting(setting, PrimaryCurrency, value)  }

  def setUiTransactionCloseDialog(value: Option[String]): ErrorF[Setting] = {
    val option = value
      .flatMap(_.tryToBool)
      .fromOption("SETTING_DATA_INVALID")

    val setting = EitherT(Future.successful(option))
      .map(_ => SettingQuery.findById(UiTransactionCloseDialog))
      .map(sql.query)
      .map(OptionT.apply)
      .flatMapF(_.fromOption("SETTING_NOT_FOUND"))

    updateSetting(setting, UiTransactionCloseDialog, value)
  }

  protected def updateSetting(setting: ErrorF[Setting], name: String, value: Option[String]): ErrorF[Setting] = {
    val savedSetting = setting.map(s => s.copy(value = value.getOrElse(s.value)))
      .map(SettingQuery.update)
      .map(sql.query)

    settingsCache.invalidate(name)

    savedSetting.map(OptionT.apply).flatMapF(_.fromOption("SETTING_NOT_UPDATED"))
  }
}
