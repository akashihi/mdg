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
    val haveCurrency = curOption.transform.flatMap {
      case Some(c) => c.right
      case None => "SETTING_DATA_INVALID".left
    }

    val setting = haveCurrency.map { _ =>
      SettingDao.findById("currency.primary")
    }
    val haveSettings = setting.map { o =>
      val i = o.map {
        case Some(s) => s.right
        case None => "SETTING_NOT_FOUND".left
      }
      i
    }
    val newSetting = haveSettings.map(o => EitherD(o)).flatten.map { s =>
      s.copy(value = value.getOrElse(s.value))
    }
    val savedSetting = newSetting.map { s =>
      SettingDao.update(s)
    }

    val result = savedSetting.map { o =>
      EitherD(o.map {
        case Some(s) => s.right
        case None => "ACCOUNT_NOT_UPDATED".left
      })
    }
    result.flatten
  }
}
