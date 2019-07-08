package dao.queries

import dao.tables.{Categories, CategoriesTree}
import models.{AccountType, Category, ClosureTable}
import slick.jdbc.PostgresProfile.api._
import dao.tables.Accounts.accountTypeMapper

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
          SELECT $leaf, $leaf, 0"""
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
    val treeQuery = categoriesTree.filter(_.depth > 0).map(_.descendant).result
    treeQuery.flatMap(tlc => categories.filterNot(_.id inSet  tlc).sortBy(c => (c.account_type.asc, c.priority.asc)).result)
  }

  def listChildren(c: Category)(implicit ec: ExecutionContext): DBIO[Seq[Category]] = {
    val query = categories join categoriesTree on (_.id === _.descendant) filter(q => q._2.ancestor === c.id.get) filter (q => q._2.depth === 1)
    query.map(_._1).sortBy(c => (c.account_type.asc, c.priority.asc)).result
  }

  def findById(id: Long): DBIO[Option[Category]] = {
    categories.filter(_.id === id).result.headOption
  }

  def findByName(name: String, account: AccountType): DBIO[Option[Category]] = {
    categories.filter(_.name === name).filter(_.account_type === account).result.headOption
  }

  def update(a: Category)(implicit ec: ExecutionContext): DBIO[Option[Category]] = {
    categories.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def reparent(c: Category, destination: Long)(implicit ec: ExecutionContext): DBIO[Option[Category]] = {
    val deleteQuery =
      sqlu"""
            DELETE FROM category_tree
            WHERE descendant IN (
              SELECT descendant FROM category_tree
              WHERE ancestor = ${c.id.get})
            AND ancestor IN (
              SELECT ancestor FROM category_tree
              WHERE descendant = ${c.id.get}
              AND ancestor != descendant
            )"""

    val reparentQuery =
      sqlu"""
             INSERT INTO category_tree (ancestor, descendant, depth)
             SELECT supertree.ancestor, subtree.descendant, supertree.depth+subtree.depth+1
             FROM category_tree AS supertree
             CROSS JOIN category_tree AS subtree
             WHERE subtree.ancestor = ${c.id.get}
             AND supertree.descendant = $destination"""

    val reparent = deleteQuery zip reparentQuery

    reparent.flatMap(_ => update(c)).transactionally
  }

  def checkCyclicParent(id: Long, parent: Long): DBIO[Option[ClosureTable]] =
    categoriesTree.filter(_.descendant === parent).filter(_.ancestor === id).result.headOption

  def delete(id: Long)(implicit ec: ExecutionContext): DBIO[Int] = {
    val a = for { acc <- AccountQuery.accounts if acc.category_id === id } yield acc.category_id
    val aUpdate = a.update(None)
    val cDelete = categories.filter(_.id === id).delete
    (aUpdate zip cDelete).transactionally.map(_._2)
  }
}
