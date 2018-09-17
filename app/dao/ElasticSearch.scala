package dao

import com.sksamuel.elastic4s._
import com.sksamuel.elastic4s.http.{ElasticClient, ElasticProperties}
import com.sksamuel.elastic4s.searches.queries.matches.MatchQuery
import javax.inject.Inject
import play.api.Configuration
import util.OptionConverters._

import scala.concurrent._

class ElasticSearch @Inject() (protected val config: Configuration)(implicit val ec: SqlExecutionContext) {
  import com.sksamuel.elastic4s.http.ElasticDsl._

  protected def getEsClient: ElasticClient = {
    val url = config.getOptional[String]("elasticsearch.url").getOrElse("http://localhost:9200")
    ElasticClient(ElasticProperties(url))
  }

  /**
    * Indexes transaction comment data to the ElasticSearch.
    * @param id SQL side transaction id.
    * @param comment Value of the comment.
    * @return True in case of success.
    */
  def saveComment(id: Long, comment: String): Future[Boolean] = {

    val response = getEsClient.execute {
      indexInto("mdg" / "tx").id(id.toString).fields("comment" -> comment).refresh(RefreshPolicy.Immediate)
    }

    response.map(_.isSuccess)
  }

  /**
    * Searches ElasticSearch for trsnaction, matching specified query string.
    * @param query Text to look for.
    * @return Array of matching SQL transaction ids.
    */
  def lookupComment(query: String): Future[Array[Long]] = {
    val response = getEsClient.execute {
      search("mdg").query(MatchQuery(field = "comment", value = query, fuzziness = Some("1.0")))
    }

    response.map { r =>
      if (r.isSuccess) {
        r.result.hits.hits.map(_.id).flatMap(_.tryToLong)
      } else {
        Array[Long]()
      }
    }
  }
}
