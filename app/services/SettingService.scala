package services

import dao.{CurrencyDao, SettingDao}
import models.Setting
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._
import util.ErrXor._
import util.OptionConverters._
import util.Validator._

import scalaz._
import Scalaz._
import scalaz.OptionT._

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

  def setCurrencyPrimary(value: Option[String]): DBIO[\/[String, Setting]] = {
    val curOption = value.flatMap(_.tryToLong).map(_.right).getOrElse("SETTING_DATA_INVALID".left)
      .map(CurrencyDao.findById)
    val haveCurrency = invert(curOption).map { o =>
      o.flatMap {
        case Some(c) => c.right
        case None => "SETTING_DATA_INVALID".left
      }
    }

    val setting = haveCurrency.map { o =>
      o.map {_ => SettingDao.findById("currency.primary")}
    }

    val haveSetting = invert(setting).map { o =>
      o.flatMap {
        case Some(s) => s.right
        case None => "SETTING_NOT_FOUND".left
      }
    }

    val newSetting = haveSetting.map { o =>
      o.map{s => s.copy(value = value.getOrElse(s.value))}
    }

    val savedSetting = newSetting.map { o =>
      o.map(s => SettingDao.update(s))
    }

    invert(savedSetting).map { o =>
      o.flatMap {
        case Some(s) => s.right
        case None => "ACCOUNT_NOT_UPDATED".left
      }
    }
  }
}
