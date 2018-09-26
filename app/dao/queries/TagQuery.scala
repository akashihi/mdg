package dao.queries

import dao.tables.Tags
import models.TxTag
import play.api.libs.concurrent.Execution.Implicits._
import slick.jdbc.PostgresProfile.api._

object TagQuery {
  val tags = TableQuery[Tags]

  def list(): DBIO[Seq[TxTag]] = tags.sortBy(_.txtag.asc).result

  def ensureIdByValue(value: String): DBIO[TxTag] = {
    tags
      .filter(_.txtag === value)
      .result
      .headOption
      .flatMap {
        case Some(x) => DBIO.successful(x)
        case None =>
          tags returning tags.map(_.id) into ((item, id) => item.copy(id = id)) += TxTag(
            Some(-1),
            value)
      }
      .transactionally
  }
}
