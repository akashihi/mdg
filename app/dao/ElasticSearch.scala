package dao

import com.sksamuel.elastic4s._
import com.sksamuel.elastic4s.analyzers._
import com.sksamuel.elastic4s.http._
import com.sksamuel.elastic4s.json.XContentBuilder
import com.sksamuel.elastic4s.searches.queries.matches.MatchQuery
import javax.inject.Inject
import play.api.Configuration
import util.OptionConverters._

import scala.concurrent._

case class HunspellTokenFilter(name:String,language: String)
  extends TokenFilterDefinition {
  val filterType = "hunspell"
  override def build(source: XContentBuilder): Unit = {
    source.field("language", language)
  }
}

class ElasticSearch @Inject() (protected val config: Configuration)(implicit val ec: SqlExecutionContext) {
  import com.sksamuel.elastic4s.http.ElasticDsl._

  private val INDEX_NAME = "mdg"

  protected def getEsClient: ElasticClient = {
    val url = config.getOptional[String]("elasticsearch.url").getOrElse("http://localhost:9200")
    ElasticClient(ElasticProperties(url))
  }

  /**
    * Deletes Elasticsearch index and all indexed data.
    * @return True in case of success.
    */
  def dropMdgIndex(): Future[Boolean] = {
    getEsClient.execute { deleteIndex(INDEX_NAME) }.map(_.isSuccess)
  }

  /**
    * Creates elasticsearch index.
    * Index is hardcoded to russian.
    * @return True in case of sucess.
    */
  def createMdgIndex(): Future[Boolean] = {
    val stopWords = Seq("а",
      "без",
      "более",
      "бы",
      "был",
      "была",
      "были",
      "было",
      "быть",
      "в",
      "вам",
      "вас",
      "весь",
      "во",
      "вот",
      "все",
      "всего",
      "всех",
      "вы",
      "где",
      "да",
      "даже",
      "для",
      "до",
      "его",
      "ее",
      "если",
      "есть",
      "еще",
      "же",
      "за",
      "здесь",
      "и",
      "из",
      "или",
      "им",
      "их",
      "к",
      "как",
      "ко",
      "когда",
      "кто",
      "ли",
      "либо",
      "мне",
      "может",
      "мы",
      "на",
      "надо",
      "наш",
      "не",
      "него",
      "нее",
      "нет",
      "ни",
      "них",
      "но",
      "ну",
      "о",
      "об",
      "однако",
      "он",
      "она",
      "они",
      "оно",
      "от",
      "очень",
      "по",
      "под",
      "при",
      "с",
      "со",
      "так",
      "также",
      "такой",
      "там",
      "те",
      "тем",
      "то",
      "того",
      "тоже",
      "той",
      "только",
      "том",
      "ты",
      "у",
      "уже",
      "хотя",
      "чего",
      "чей",
      "чем",
      "что",
      "чтобы",
      "чье",
      "чья",
      "эта",
      "эти",
      "это",
      "я")
    val stopWordsFilter = StopTokenFilter("stop_ru", stopwords = stopWords, ignoreCase = Some(true))
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
    val analyzer = CustomAnalyzerDefinition("ru_RU", triplets, ru_mapping, stopWordsFilter, wordDelimiter, language)
    getEsClient.execute {
      createIndex(INDEX_NAME).mappings(mapping("tx").fields(textField("comment")).analyzer("ru_RU")).analysis(analyzer).settings(Map("number_of_shards" -> 1))
    }.map(_.isSuccess)
  }

  /**
    * Indexes transaction comment data to the ElasticSearch.
    * @param id SQL side transaction id.
    * @param comment Value of the comment.
    * @return True in case of success.
    */
  def saveComment(id: Long, comment: String): Future[Boolean] = {

    val response = getEsClient.execute {
      indexInto(INDEX_NAME / "tx").id(id.toString).fields("comment" -> comment).refresh(RefreshPolicy.Immediate)
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
      search(INDEX_NAME).query(MatchQuery(field = "comment", value = query, fuzziness = Some("1.0")))
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
