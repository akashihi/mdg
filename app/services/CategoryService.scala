package services
import controllers.dto.CategoryDTO
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import models.AssetAccount
import util.EitherOps.ErrorF

import scala.concurrent._
import scalaz._
import Scalaz._

class CategoryService  @Inject() (protected val sql: SqlDatabase)
                                 (implicit ec: SqlExecutionContext) {

  def create(dto: Option[CategoryDTO]): ErrorF[CategoryDTO] = ???
  def list(): Future[Seq[CategoryDTO]] = ???
  def get(id: Long): ErrorF[CategoryDTO] = {
    val dto: Future[\/[String, CategoryDTO]] = Future.successful(CategoryDTO(Some(1), "test", AssetAccount, 1, None, Seq.empty[CategoryDTO]).right)
    EitherT(dto)
  }
  def edit(id: Long, dto: Option[CategoryDTO]): ErrorF[CategoryDTO] = ???
  def delete(id: Long): ErrorF[Int] = ???
}
