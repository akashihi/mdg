package services

import javax.inject.Inject

import controllers.dto.{OperationDto, TransactionDto, TransactionWrapperDto}
import dao.filters.TransactionFilter
import dao.ordering.{Page, SortBy}
import dao.{TagDao, TransactionDao}
import models.{Operation, Transaction}
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.PostgresDriver.api._

import scala.concurrent._
import _root_.util.Validator._

import scalaz._
import Scalaz._

/**
  * Transaction operations service.
  */
class TransactionService @Inject()(
    protected val tagDao: TagDao,
    protected val errors: ErrorService,
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {

  /**
    * Clears transaction of empty operations.
    * @param tx Transaction (DTO) to process.
    * @return Transaction (DTO) without useless operations.
    */
  def stripEmptyOps(tx: TransactionDto): TransactionDto =
  tx.copy(operations = removeEmptyOps(tx.operations))

  /**
    * Removes empty operations from list of (DTO) operations.
    * Empty operation is the operation that doesn't influences
    * transaction balance (i.e. with amount equal to zero).
    *
    * @param ops list to process.
    * @return list with non-empty operations only.
    */
  def removeEmptyOps(ops: Seq[OperationDto]): Seq[OperationDto] =
    ops.filter(o => o.amount != 0)

  /**
    * Extracts Transaction (DTO) data from the
    * supplied wrapper and checks for data validity.
    * @param id Separately defined transaction id.
    * @param wrapper TransactoinWrapperDto object.
    * @return Error XOR valid Transaction(DTO) object.
    */
  def prepareTransactionDto(id: Option[Long], wrapper: Option[TransactionWrapperDto]): \/[String,TransactionDto] = {
    val d = wrapper match {
      case None => "TRANSACTION_DATA_INVALID".left
      case Some(x) => x.right
    }
    d.map { x => x.data.attributes }
      .map { x => x.copy(id = id)}
      .map {stripEmptyOps}
      .map {validate}
      .flatMap {validationToXor}
  }

  /**
    * Converts transaction object to the DTO.
    * @param tx Transaction to convert.
    * @return Fully filled DTO object.
    */
  def txToDto(tx: Transaction): DBIO[TransactionDto] = {
    for {
      o <- TransactionDao
        .listOperations(tx.id.get)
        .map(x => x.map(o => OperationDto(o.account_id, o.amount)))
      t <- TransactionDao.listTags(tx.id.get).map(x => x.map(_.txtag))
    } yield
      TransactionDto(Some(tx.id.get),
                     tx.timestamp,
                     tx.comment,
                     operations = o,
                     tags = t)
  }

  /**
    * Creates new transaction.
    * @param tx transaction description object.
    * @return transaction description object with id.
    */
  def add(tx: TransactionDto): DBIO[TransactionDto] = {
    val transaction = Transaction(tx.id, tx.timestamp, tx.comment)
    val tags = tx.tags.map(tagDao.ensureIdByValue)
    val operations = tx.operations.map { x =>
      Operation(-1, -1, x.account_id, x.amount)
    }
    TransactionDao.insert(transaction, operations, tags).flatMap(txToDto)
  }

  /**
    * Returns all transaction objects from the database.
    * @return Sequence of transaction DTOs.
    */
  def list(filter: TransactionFilter,
           sort: Seq[SortBy],
           page: Option[Page]): DBIO[Seq[TransactionDto]] =
    TransactionDao
      .list(filter, sort, page)
      .flatMap(s => DBIO.sequence(s.map(t => txToDto(t))))

  /**
    * Retrieves specific Transaction.
    * @param id transaction unique id.
    * @return DTO object.
    */
  def get(id: Long): DBIO[Option[TransactionDto]] = {
    val tx = TransactionDao.findById(id)
    tx.flatMap {
      case Some(x) => txToDto(x).map(t => Some(t))
      case None => DBIO.successful(None)
    }
  }

  def replace(id: Long, tx: TransactionDto): DBIO[\/[String, TransactionDto]] = {
    TransactionDao.delete(id).flatMap {
      case 1 => add(tx)map(_.right)
      case _ => DBIO.successful("TRANSACTION_NOT_FOUND".left)
    }
  }

  /**
    * Removes transaction and all dependent objects.
    *
    * @param id identificator of transaction to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    TransactionDao.delete(id).map {
      case 1 => 1.right
      case _ => "TRANSACTION_NOT_FOUND".left
    }
  }
}
