package controllers.api

import controllers.api.JsonWrapper._
import models.Error
import play.api.http.Status._
import play.api.mvc.{Result, Results}
import util.OptionConverters._

trait ResultMakeable[T] {
  def makeResult(x: Seq[T], count: Int)(status: Int): Result

  def makeResult(x: Seq[T])(status: Int): Result

  def makeResult(x: T)(status: Int): Result
}

object ResultMakeable {
  implicit val makeIdentifiable = new ResultMakeable[IdentifiableObject] {
    override def makeResult(x: IdentifiableObject)(status: Int): Result =
      new Results.Status(status)(wrapJson(x))

    override def makeResult(x: Seq[IdentifiableObject])(status: Int): Result =
      new Results.Status(status)(wrapJson(x))

    override def makeResult(x: Seq[IdentifiableObject], count: Int)(status: Int): Result =
      new Results.Status(status)(wrapJson(x, Some(count)))
  }

  implicit val makeError = new ResultMakeable[Error] {
    override def makeResult(x: Error)(status: Int): Result =
      new Results.Status(status)(wrapJson(x))

    override def makeResult(x: Seq[Error])(status: Int): Result =
      makeResult(x.head)(status)

    override def makeResult(x: Seq[Error], count: Int)(status: Int): Result =
      makeResult(x.head)(status)
  }
}

object ResultMaker {
  def makeResult[T >: IdentifiableObject](x: T)(status: Int)(
      implicit ev: ResultMakeable[T]): Result = ev.makeResult(x)(status)
  def makeResult[T >: IdentifiableObject](x: Seq[T])(status: Int)(
      implicit ev: ResultMakeable[T]): Result = ev.makeResult(x)(status)
  def makeResult[T >: IdentifiableObject](x: Seq[T], count: Int)(status: Int)(
    implicit ev: ResultMakeable[T]): Result = ev.makeResult(x, count)(status)
  def makeResult(x: Error)(implicit ev: ResultMakeable[Error]): Result =
    ev.makeResult(x)(x.status.tryToInt().getOrElse(INTERNAL_SERVER_ERROR))
}
