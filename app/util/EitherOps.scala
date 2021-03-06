package util

import Function.tupled
import scalaz._
import Scalaz._

import scala.concurrent._

object EitherOps {
  /**
    * Future specific EitherT type for convenience
    * @tparam L type of -\/
    * @tparam R type of \/-
    */
  type EitherF[L, R] = EitherT[Future, L ,R]

  /**
    * String error specialization of EitherF
    * @tparam R type of \/-
    */
  type ErrorF[R] = EitherF[String, R]

  /**
    * Future specific OptionT type for convenience
    * @tparam L type of value
    */
  type OptionF[L] = OptionT[Future, L]

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
    def fromOption(l: L)(implicit ec: ExecutionContext): Future[L \/ R]= o.run.map(_.map(_.right).getOrElse(l.left))
  }

  /**
    * Converts different combination of \/ and Future to EitherF
    *
    * @param o object to convert
    */
  implicit class EitherFOps1[R](val o: \/[String, Future[R]]) extends AnyVal {
    def transform(implicit ec: ExecutionContext): ErrorF[R] = {
      val r = o match {
        case -\/(e) => Future.successful(e.left)
        case \/-(e) => e.map(_.right)
      }
      EitherT(r)
    }
  }

  /**
    * Converts different combination of \/ and DBIO to EitherF
    *
    * @param o object to convert
    */
  implicit class EitherFOps2[R](val o: Future[\/[String, R]])
    extends AnyVal {
    def transform: ErrorF[R] = EitherT(o)
  }

  /**
    * Flattens internal Future
    * @param o ErrorF with value wrapped to Future
    */
  implicit class EitherFFlatten1[R](val o: ErrorF[Future[R]])
    extends AnyVal {
    def flatten(implicit ec: ExecutionContext): ErrorF[R] = EitherT(o.run.map(_.transform).flatMap(_.run))
  }

  implicit class ErrorFZip[R,B](val o: ErrorF[R]) extends AnyVal {
    def zip(other: ErrorF[B])(implicit ex: ExecutionContext):ErrorF[(R,B)] = {
      val futures = o.run zip other.run

      val zipped = futures map tupled {(l,r) => l match {
        case -\/(e) => e.left
        case \/-(lv) => r match {
          case -\/(e) => e.left
          case \/-(rv) => (lv, rv).right
        }
      }}
      EitherT(zipped)
    }
  }
}
