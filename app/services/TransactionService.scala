package services

import javax.inject.Inject

import controllers.dto.{OperationDto, TransactionDto}
import dao.{TagDao, TransactionDao}
import models.{Operation, Transaction}
import play.api.db.slick.DatabaseConfigProvider
import play.api.mvc._

import scala.concurrent._
import scala.concurrent.duration._

/**
  * Transaction operations service.
  */
class TransactionService @Inject()(
                                    protected val tagDao: TagDao,
                                    protected val transactionDao: TransactionDao,
                                    protected val errors: ErrorService,
                                    protected val dbConfigProvider: DatabaseConfigProvider)
                                  (implicit ec: ExecutionContext) {

  /**
    * Removes empty operations from list of (DTO) operations.
    * Empty operation is the operation that doesn't influences
    * transaction balance (i.e. with amount equal to zero).
    *
    * @param ops list to process.
    * @return list with non-empty operations only.
    */
  def stripEmptyOps(ops: Seq[OperationDto]): Seq[OperationDto] = ops.filter(o => o.amount != 0)

  /**
    * Checks list of (DTO) operations for validity.
    * Valid list should have it's balance (sum of all amounts)
    * equal to zero and have at list one operation simultaneously.
    *
    * @param ops list to process.
    * @return error in case of invalid list.
    */
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

  /**
    * Converts transaction object to the DTO.
    * @param tx Transaction to convert.
    * @return Fully filled DTO object.
    */
  def txToDto(tx: Transaction): Future[TransactionDto] = {
    for {
      o <- transactionDao.listOperations(tx.id).map(x => x.map(o => OperationDto(o.account_id, o.amount)))
      t <- transactionDao.listTags(tx.id).map(x => x.map(_.txtag))
    } yield TransactionDto(Some(tx.id), tx.timestamp, tx.comment, operations = o, tags = t)
  }

  def add(tx: TransactionDto): Future[TransactionDto] = {
    val transaction = Transaction(0, tx.timestamp, tx.comment)
    val tags = tx.tags.map(tagDao.ensureIdByValue)
    val operations = tx.operations.map { x => Operation(-1, -1, x.account_id, x.amount) }
    transactionDao.insert(transaction, operations, tags).flatMap(txToDto)
  }

  def list(): Future[Seq[TransactionDto]] = {
    transactionDao.list().flatMap(s => Future.sequence(s.map(t => txToDto(t))))
  }
}
