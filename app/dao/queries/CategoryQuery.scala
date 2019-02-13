package dao.queries

import dao.tables.Categories
import models.Category
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object CategoryQuery {
  val categories = TableQuery[Categories]

  def insert(a: Category): DBIO[Category] = categories returning categories
    .map(_.id) into ((item, id) => item.copy(id = id)) += a

  def list: DBIO[Seq[Category]] = categories.result

  def findById(id: Long): DBIO[Option[Category]] = {
    categories.filter(_.id === id).result.headOption
  }

  def update(a: Category)(implicit ec: ExecutionContext): DBIO[Option[Category]] = {
    categories.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def delete(id: Long)(implicit ec: ExecutionContext): DBIO[Int] = categories.filter(_.id === id).delete
}
