package dao

import com.google.inject.Provider
import com.sksamuel.elastic4s._
import com.sksamuel.elastic4s.http.JavaClient
import com.sksamuel.elastic4s.requests.analyzers._
import com.sksamuel.elastic4s.requests.common.RefreshPolicy
import com.sksamuel.elastic4s.requests.searches.queries.matches.MatchQuery
import javax.inject.Inject
import play.Application
import play.api.{Configuration, Logger}
import play.libs.Scala
import util.OptionConverters._

import scala.concurrent._

case class HunspellTokenFilter(name:String,language: String)
  extends TokenFilterDefinition {
  val filterType = "hunspell"
  override def build(source: XContentBuilder): Unit = {
    source.field("language", language)
  }
}

class ElasticSearch @Inject() (protected val config: Configuration, protected val app: Provider[Application])(implicit val ec: SqlExecutionContext) {
  import com.sksamuel.elastic4s.ElasticDsl._

  private val INDEX_NAME = "mdg"
  private val log: Logger = Logger(this.getClass)
  private val client = getEsClient

  protected def getEsClient: ElasticClient = {
    val url = config.getOptional[String]("elasticsearch.url").getOrElse("http://localhost:9200")
    ElasticClient(JavaClient(ElasticProperties(url)))
  }

  def logEsError[T](response: Response[T]): Response[T] = {
    if (response.isError) {
      log.error(s"ES call failed with error ${response.error.`type`} caused by ${response.error.reason}")
    }
    response
  }

  /**
    * Deletes Elasticsearch index and all indexed data.
    * @return True in case of success.
    */
  def dropMdgIndex(): Future[Boolean] = {
    client.execute { deleteIndex(INDEX_NAME) }.map(logEsError).map { r =>
      if (r.isError && r.error.`type` == "index_not_found_exception") {
        // Ok, we failed to delete non existing index, this is fine
        true
      } else {
        r.isSuccess
      }
    }
  }

  /**
    * Creates elasticsearch index.
    * Index is hardcoded to russian.
    * @return True in case of sucess.
    */
  def createMdgIndex(): Future[Boolean] = {
    val languageCode = "ru"

    val stopWordsFile = app.get().classloader().getResourceAsStream("elasticsearch/stopwords." + languageCode)
    val stopWords = scala.io.Source.fromInputStream(stopWordsFile, "UTF-8").getLines().toSeq
    log.info(s"Loaded ${stopWords.length} stop words")
    val stopWordsFilter = StopTokenFilter("stop", stopwords = stopWords, ignoreCase = Some(true))

    val triplets = NGramTokenizer("triplets", minGram=3, maxGram=3, tokenChars=Seq("letter", "digit"))

    val ru_mapping = MappingCharFilter("ru_mapping", "Ё" -> "Е", "ё" -> "е")
    val wordDelimiter = WordDelimiterTokenFilter("delimiter",
      generateWordParts = Some(true),
      generateNumberParts = Some(true),
      catenateWords = Some(true),
      catenateNumbers = Some(false),
      catenateAll = Some(true),
      splitOnCaseChange = Some(true),
      preserveOriginal = Some(true),
      splitOnNumerics = Some(false)
    )
    val language = HunspellTokenFilter("ru_RU", language = "ru")
    val comment_analyzer = CustomAnalyzerDefinition("ru_RU", triplets, ru_mapping, stopWordsFilter, wordDelimiter, language)
    val tags_analyzer = CustomAnalyzerDefinition("ru_RU_tags", triplets, ru_mapping, wordDelimiter, language)
    client.execute {
      createIndex(INDEX_NAME)
        .mappings(
          mapping("tx").fields(
            textField("comment").analyzer("ru_RU"), textField("tags").analyzer("ru_RU_tags")
          )
        )
        .analysis(comment_analyzer, tags_analyzer)
        .settings(Map("number_of_shards" -> 1))
    }.map(logEsError).map(_.isSuccess)
  }

  /**
    * Indexes transaction comment data to the ElasticSearch.
    * @param id SQL side transaction id.
    * @param comment Value of the comment.
    * @return True in case of success.
    */
  def saveTx(id: Long, comment: String, tags: Seq[String]): Future[Boolean] = {

    val response = client.execute {
      indexInto(INDEX_NAME + "/" + "tx").id(id.toString).fields("comment" -> comment, "tags" -> tags).refresh(RefreshPolicy.Immediate)
    }

    response.map(logEsError).map(_.isSuccess)
  }

  protected def lookupTransaction(field: String)(query: String): Future[Array[Long]] = {
    val response = client.execute {
      search(INDEX_NAME).query(MatchQuery(field = field, value = query, fuzziness = Some("1.0")))
    }

    response.map(logEsError).map { r =>
      if (r.isSuccess) {
        r.result.hits.hits.map(_.id).flatMap(_.tryToLong)
      } else {
        Array[Long]()
      }
    }
  }

  /**
    * Searches ElasticSearch for transaction, with comment matching specified query string.
    * @return Array of matching SQL transaction ids.
    */
  def lookupComment: String => Future[Array[Long]] = lookupTransaction("comment")

  /**
    * Searches ElasticSearch for transaction, with tags matching specified query string.
    * @return Array of matching SQL transaction ids.
    */
  def lookupTags: String => Future[Array[Long]] = lookupTransaction("tags")
}
