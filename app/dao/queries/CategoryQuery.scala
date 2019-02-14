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

  def insert(c: Category): DBIO[Category] = categories returning categories
    .map(_.id) into ((item, id) => item.copy(id = id)) += c

  def insertLeaf(parent: Long, a: Category)(implicit ec: ExecutionContext): DBIO[Category] = {
    insert(a).flatMap(aId => addLeaf(parent, aId.id.get).map(_ => aId).transactionally)
  }

  /**
    * Unconditional listing should only return top-level categories.
    * @return List of top-level categories.
    */
  def list(implicit ec: ExecutionContext): DBIO[Seq[Category]] = {
    val treeQuery = categoriesTree.filter(_.depth > 1).map(_.descendant).result
    treeQuery.flatMap(tlc => categories.filterNot(_.id inSet  tlc).sortBy(_.priority.asc).result)
  }

  def listChildren(c: Category)(implicit ec: ExecutionContext): DBIO[Seq[Category]] = {
    val query = categories join categoriesTree on (_.id === _.descendant) filter(q => q._2.ancestor === c.id.get) filter (q => q._2.depth === 2)
    query.map(_._1).sortBy(_.priority.asc).result
  }

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
