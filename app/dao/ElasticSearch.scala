package dao

import com.sksamuel.elastic4s._
import com.sksamuel.elastic4s.http.{ElasticClient, ElasticProperties}
import javax.inject.Inject
import play.api.Configuration

class ElasticSearch @Inject() (protected val config: Configuration) {
  import com.sksamuel.elastic4s.http.ElasticDsl._

  def saveComment(comment: String): Boolean = {
    val url = config.getOptional[String]("elasticsearch.url").getOrElse("http://localhost:9200")
    val client = ElasticClient(ElasticProperties(url))

    val response = client.execute {
      indexInto("mdg" / "tx").fields("comment" -> comment).refresh(RefreshPolicy.Immediate)
    }.await

    response.isSuccess
  }
}
