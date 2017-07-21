package util

import slick.dbio._
import play.api.libs.concurrent.Execution.Implicits._

import scalaz._
import Scalaz._
import scala.reflect.ClassTag

object ErrXor {
  private def pivot[T](in: => \/[String, DBIO[T]]): DBIO[\/[String, T]] = {
    in match {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(e) => e.map(_.right)
    }
  }

  def invert[T, X: ClassTag](in: => \/[String, DBIO[T]]): DBIO[\/[String, T]] = pivot(in)

  def invert[T](in: => \/[String, DBIO[\/[String, T]]]): DBIO[\/[String, T]] = pivot(in).map(_.flatMap(identity))

  def invert[T, X: ClassTag, Y: ClassTag](in: => DBIO[\/[String, DBIO[T]]]): DBIO[\/[String, T]] = in.map { e => pivot(e) } flatMap identity
}
