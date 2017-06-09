package dao

import models.TxTag
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._

object TagDao {
  val tags = TransactionDao.tags

  def ensureIdByValue(value: String): DBIO[TxTag] = {
        tags
          .filter(_.txtag === value)
          .result
          .headOption
          .flatMap {
            case Some(x) => DBIO.successful(x)
            case None =>
              tags returning tags.map(_.id) into (
                  (item,
                   id) => item.copy(id = id)) += TxTag(-1, value)
          }
          .transactionally
  }
}
