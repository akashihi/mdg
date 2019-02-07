package dao.tables

import models.ClosureTable
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

class CategoryTree(tag: Tag) extends Table[ClosureTable](tag, "category_tree") {
  def ancestor = column[Long]("ancestor")
  def descendant = column[Long]("descendant")
  def depth = column[Int]("depth")
  def * = (ancestor, descendant, depth) <> ((ClosureTable.apply _).tupled, ClosureTable.unapply)
}
