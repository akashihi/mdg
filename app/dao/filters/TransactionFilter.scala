package dao.filters

import java.time.LocalDateTime

import play.api.libs.json._

/**
  * Transaction filtering operations.
  */
case class TransactionFilter(
                              comment: Option[String] = None,
                              tag: Option[Seq[String]] = None,
                              account_id: Option[Seq[Long]] = None,
                              notEarlier: Option[LocalDateTime] = None,
                              notLater: Option[LocalDateTime] = None
                            )

object TransactionFilter {
  implicit val transactionFilterRead = Json.reads[TransactionFilter]
  implicit def stringToLDT(s: Option[String]): Option[LocalDateTime] = {
    s.flatMap { d =>
      try {
        Some(LocalDateTime.parse(d))
      } catch {
        case e @ (_: IllegalArgumentException | _: UnsupportedOperationException) => None
      }
    }
  }
}
