package dao

import javax.inject._

import dao.tables.Tags
import models.TxTag
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._
import scala.concurrent.duration._

class TagDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val tags = TableQuery[Tags]

  def ensureIdByValue(value: String): TxTag = {
    Await.result(db.run(tags.filter(_.txtag === value).result.headOption.flatMap {
      case Some(x) => DBIO.successful(x)
      case None => tags returning tags.map(_.id) into ((item, id) => item.copy(id = id)) += TxTag(-1, value)
    }.transactionally
    ), 500 millis)
  }
}
