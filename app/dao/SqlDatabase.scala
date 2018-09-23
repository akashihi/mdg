package dao

import akka.actor.ActorSystem
import javax.inject.Inject
import play.api.db.slick._
import play.api.libs.concurrent.CustomExecutionContext
import slick.basic.DatabasePublisher
import slick.dbio.{DBIO, StreamingDBIO}
import slick.jdbc.JdbcProfile

import scala.concurrent._

class SqlExecutionContext @Inject()(actorSystem: ActorSystem)
  extends CustomExecutionContext(actorSystem, "mdg-sql-dispatcher")

class SqlDatabase @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: SqlExecutionContext)
  extends HasDatabaseConfigProvider[JdbcProfile] {
  def query[T](q: DBIO[T]): Future[T] = db.run(q)
  def stream[T](q: StreamingDBIO[Seq[T], T]): DatabasePublisher[T] = db.stream(q)
}
