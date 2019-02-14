package dao.queries

import dao.tables.{Categories, CategoriesTree}
import models.Category
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object CategoryQuery {
  val categories = TableQuery[Categories]
  val categoriesTree = TableQuery[CategoriesTree]

  def addLeaf(parent: Long, leaf: Long): DBIO[Int] = {
    sqlu"""
      INSERT INTO category_tree (ancestor, descendant, depth)
        SELECT t.ancestor, $leaf, t.depth + 1
        FROM category_tree AS t
        WHERE t.descendant = $parent
        UNION ALL
          SELECT $leaf, $leaf, 1"""
  }

  def insert(a: Category): DBIO[Category] = categories returning categories
    .map(_.id) into ((item, id) => item.copy(id = id)) += a

  def insertLeaf(parent: Long, a: Category)(implicit ec: ExecutionContext): DBIO[Category] = {
    insert(a).flatMap(aId => addLeaf(parent, aId.id.get).map(_ => aId).transactionally)
  }

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
