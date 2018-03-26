package dao

import dao.tables.Settings
import models.Setting
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._

object SettingDao {
  val settings = TableQuery[Settings]

  def list(): DBIO[Seq[Setting]] =
    settings.result

  def findById(id: String): DBIO[Option[Setting]] =
    settings.filter(_.id === id).result.headOption

  def update(a: Setting): DBIO[Option[Setting]] = {
    settings.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }
}
