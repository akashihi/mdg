package util

import slick.dbio.DBIO
import play.api.libs.concurrent.Execution.Implicits._

import scala.reflect.ClassTag
import scalaz._
import Scalaz._

/**
  * Monad transformer for DBIO[\/[L, R]]
  */
case class EitherD[L, R](run: DBIO[L \/ R]) {
  def map[T](f: R => T): EitherD[L, T] =
    EitherD(run.map { either: \/[L, R] =>
      either.map(f)
    })
  def flatMap[T](f: R => \/[L, T]): EitherD[L, T] =
    EitherD(run.map { either: \/[L, R] =>
      either.flatMap(f)
    })
}

object EitherD {

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/.
    * @tparam L type of -\/
    * @tparam R type of \/-
    * @return \/ inside of DBIO.
    */
  private def pivot[L, R](in: => \/[L, DBIO[R]]): DBIO[\/[L, R]] = {
    in match {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(e) => e.map(_.right)
    }
  }

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/.
    * @tparam L type of -\/
    * @tparam R type of \/-
    * @return \/ inside of DBIO.
    */
  def apply[L, R](in: => \/[L, DBIO[R]]): EitherD[L, R] = EitherD(pivot(in))

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in \/ inside of DBIO inside of \/
    * @tparam L type of -\/
    * @tparam R type of \/-
    * @tparam X unused. This parameter is needed to workaround type erasure.
    * @return \/ inside of DBIO.
    */
  def apply[L, R, X: ClassTag](in: => \/[L, DBIO[\/[L, R]]]): EitherD[L, R] =
    EitherD(pivot(in).map(_.flatMap(identity)))

  /**
    * Reverse order of \/ and DBIO monads.
    * @param in DBIO inside of \/ inside of DBIO
    * @tparam L type of -\/
    * @tparam R type of \/-
    * @tparam X unused. This parameter is needed to workaround type erasure.
    * @tparam Y unused. This parameter is needed to workaround type erasure.
    * @return \/ inside of DBIO.
    */
  def apply[L, R, X: ClassTag, Y: ClassTag](
      in: => DBIO[\/[L, DBIO[R]]]): EitherD[L, R] = {
    val pivoted = in.map { e =>
      pivot(e)
    } flatMap identity
    EitherD(pivoted)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    * @param o object to convert
    */
  implicit class EitherDFlatten[L, R](val o: EitherD[L, EitherD[L, R]])
      extends AnyVal {
    def flatten: EitherD[L, R] = {
      val result = o.run flatMap {
        case -\/(l) => DBIO.successful(l.left)
        case \/-(r) => r.run
      }
      EitherD(result)
    }
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    * @param o object to convert
    */
  implicit class EitherDOps1[L, R](val o: \/[L, DBIO[R]]) extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    * @param o object to convert
    */
  implicit class EitherDOps2[L, R](val o: \/[L, DBIO[\/[L, R]]])
      extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    * @param o object to convert
    */
  implicit class EitherDOps3[L, R](val o: DBIO[\/[L, DBIO[R]]])
      extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }
}
