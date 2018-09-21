package dao

import akka.actor.ActorSystem
import javax.inject.Inject
import play.api.db.slick._
import play.api.libs.concurrent.CustomExecutionContext
import slick.dbio.DBIO
import slick.jdbc.JdbcProfile

import scala.concurrent._

class SqlExecutionContext @Inject()(actorSystem: ActorSystem)
  extends CustomExecutionContext(actorSystem, "mdg-sql-dispatcher")

class SqlDatabase @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: SqlExecutionContext)
  extends HasDatabaseConfigProvider[JdbcProfile] {
  def query[T](q: DBIO[T]): Future[T] = db.run(q)
}
