package util

import slick.dbio._
import play.api.libs.concurrent.Execution.Implicits._

import scalaz._
import Scalaz._
import scala.reflect.ClassTag

/**
  * Error passing helpers.
  */
object ErrXor {
  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/.
    * @tparam T type of DBIO parameter.
    * @return \/ inside of DBIO.
    */
  private def pivot[T](in: => \/[String, DBIO[T]]): DBIO[\/[String, T]] = {
    in match {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(e) => e.map(_.right)
    }
  }

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/.
    * @tparam T type of DBIO parameter.
    * @return \/ inside of DBIO.
    */
  def invert[T](in: => \/[String, DBIO[T]]): DBIO[\/[String, T]] = pivot(in)

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in \/ inside of DBIO inside of \/
    * @tparam T T type of DBIO parameter.
    * @tparam X unused. This parameter is needed to workaround type erasure.
    * @return \/ inside of DBIO.
    */
  def invert[T, X: ClassTag](in: => \/[String, DBIO[\/[String, T]]]): DBIO[\/[String, T]] = pivot(in).map(_.flatMap(identity))

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/ inside of DBIO
    * @tparam T T type of DBIO parameter.
    * @tparam X unused. This parameter is needed to workaround type erasure.
    * @tparam Y unused. This parameter is needed to workaround type erasure.
    * @return \/ inside of DBIO.
    */
  def invert[T, X: ClassTag, Y: ClassTag](in: => DBIO[\/[String, DBIO[T]]]): DBIO[\/[String, T]] = in.map { e => pivot(e) } flatMap identity
}
