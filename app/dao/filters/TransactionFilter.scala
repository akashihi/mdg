package dao.filters

import play.api.libs.json._

/**
  * Transaction filtering operations.
  */
case class TransactionFilter(comment: Option[String], tag: Option[Seq[String]], account_id: Option[Seq[Long]])

object TransactionFilter {
  implicit val transactionFilterRead = Json.reads[TransactionFilter]
}
