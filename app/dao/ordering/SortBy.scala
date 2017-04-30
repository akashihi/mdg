package dao.ordering

/**
  * Sorting descriptor library
  */
sealed abstract class SortDirection

case object Asc extends SortDirection
case object Desc extends SortDirection

case class SortBy(field: String, direction: SortDirection)

object SortBy {
  implicit def parseString(sort: String): Seq[SortBy] = {
    sort.split(",").toSeq.map { s =>
      if (s.startsWith("-")) {
        SortBy(s.stripPrefix("-"), Asc)
      } else {
        SortBy(s, Desc)
      }
    }
  }
}
