package controllers.api

import controllers.api.JsonWrapper._
import models.Error
import play.api.http.Status._
import play.api.mvc.{Result, Results}
import util.OptionConverters._

object ResultMaker {
  def makeResult[T](x: IdentifiableObject[T])(status: Int): Result =
    new Results.Status(status)(wrapJson(x))
  def makeResult[T](x: Seq[IdentifiableObject[T]])(status: Int): Result =
    new Results.Status(status)(wrapJson(x))
  def makeResult[T](x: Seq[IdentifiableObject[T]], count: Int)(
      status: Int): Result =
    new Results.Status(status)(wrapJson(x, Some(count)))
  def makeResult(x: Error): Result =
    new Results.Status(x.status.tryToInt().getOrElse(INTERNAL_SERVER_ERROR))(
      wrapJson(x))
}
