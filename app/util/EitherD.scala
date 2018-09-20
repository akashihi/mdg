package util

import slick.dbio.DBIO
import play.api.libs.concurrent.Execution.Implicits._

import scala.reflect.ClassTag
import scalaz._
import Scalaz._

import scala.concurrent._

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
    * Future specific EitherT type for convenience
    * @tparam L type of -\/
    * @tparam R type of \/-
    */
  type EitherF[L, R] = EitherT[Future, L ,R]

  /**
    * Future specific OptionT type for convenience
    * @tparam L type of value
    */
  type OptionF[L] = OptionT[Future, L]

  /**
    * Reverse order of \/ and DBIO monads.
    *
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
    *
    * @param in DBIO inside of \/.
    * @tparam L type of -\/
    * @tparam R type of \/-
    * @return \/ inside of DBIO.
    */
  def apply[L, R](in: => \/[L, DBIO[R]]): EitherD[L, R] = EitherD(pivot(in))

  /**
    * Reverse order of \/ and DBIO monads.
    *
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
    *
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
    *
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

  implicit class EitherDFlatten1[L, R](val o: EitherD[L, DBIO[R]])
    extends AnyVal {
    def flatten: EitherD[L, R] = EitherD(o.run)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    *
    * @param o object to convert
    */
  implicit class EitherDOps1[L, R](val o: \/[L, DBIO[R]]) extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    *
    * @param o object to convert
    */
  implicit class EitherDOps2[L, R](val o: \/[L, DBIO[\/[L, R]]])
    extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    *
    * @param o object to convert
    */
  implicit class EitherDOps3[L, R](val o: DBIO[\/[L, DBIO[R]]])
    extends AnyVal {
    def transform: EitherD[L, R] = EitherD(o)
  }

  /**
    * Converts Option to \/
    *
    * @param o object to convert
    */
  implicit class XorFromOptionOps[L, R](val o: Option[R]) extends AnyVal {
    def fromOption(l: L): L \/ R = o.map(_.right).getOrElse(l.left)
  }

  /**
    * Converts OptionT to \/
    *
    * @param o object to convert
    */
  implicit class XorFromOptionTOps[L, R](val o: OptionF[R]) extends AnyVal {
    def fromOption(l: L): Future[L \/ R]= o.run.map(_.map(_.right).getOrElse(l.left))
  }

  /**
    * Converts different combination of \/ and Future to EitherT
    *
    * @param o object to convert
    */
  implicit class EitherTOps1[L, R](val o: \/[L, Future[R]]) extends AnyVal {
    def transform: EitherF[L, R] = {
      val r = o match {
        case -\/(e) => Future.successful(e.left)
        case \/-(e) => e.map(_.right)
      }
      EitherT(r)
    }
  }

  /**
    * Converts different combination of \/ and DBIO to EitherD
    *
    * @param o object to convert
    */
  implicit class EitherTOps2[L, R](val o: Future[\/[L, R]])
    extends AnyVal {
    def transform: EitherF[L, R] = EitherT(o)
  }

}
