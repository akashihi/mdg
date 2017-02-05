package services

import javax.inject.Inject

import controllers.dto.OperationDto
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._

import scala.concurrent._

/**
  * Transaction operations service.
  */
class TransactionService @Inject()(protected val errors: ErrorService, protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  def stripEmptyOps(ops: Seq[OperationDto]): Seq[OperationDto] = ops.filter(o => o.amount != 0)

  def invalidateOperations(ops: Seq[OperationDto]): Option[Future[Result]] = {
    if (ops.map(o => o.amount).sum != 0) {
      Some(errors.errorFor("TRANSACTION_NOT_BALANCED"))
    } else {
      if (!ops.exists(o => o.amount != 0)) {
        Some(errors.errorFor("TRANSACTION_EMPTY"))
      } else {
        None
      }
    }
  }
}
