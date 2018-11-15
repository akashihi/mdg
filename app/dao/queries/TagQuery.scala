package dao.queries

import dao.tables.Tags
import models.TxTag
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object TagQuery {
  val tags = TableQuery[Tags]

  def list(): DBIO[Seq[TxTag]] = tags.sortBy(_.txtag.asc).result

  def ensureIdByValue(value: String)(implicit ec: ExecutionContext): DBIO[TxTag] = {
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
