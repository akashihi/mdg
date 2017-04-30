package controllers.api

import javax.inject.Inject
import akka.stream.Materializer
import play.api.mvc._
import scala.concurrent._

/**
  * Adds predefined content-type to every outgoing Result.
  */
class CustomContentTypeAddingFilter @Inject()(implicit val mat: Materializer,
                                              ec: ExecutionContext)
    extends Filter {
  override def apply(next: (RequestHeader) => Future[Result])(
      rh: RequestHeader): Future[Result] = {
    next.apply(rh).map { result =>
      result.as("application/vnd.mdg+json")
    }
  }
}
