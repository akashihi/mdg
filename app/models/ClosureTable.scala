package models

class ClosureTable[T](ancestor: T, descendant: T, depth: Long)

object ClosureTable {
  type LongClosureTable = ClosureTable[Long]
}