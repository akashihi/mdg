package services
import controllers.dto.CategoryDTO
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import models.Category
import util.EitherOps._

import scala.concurrent._
import scalaz._
import Scalaz._
import dao.queries.CategoryQuery

class CategoryService  @Inject() (protected val sql: SqlDatabase)
                                 (implicit ec: SqlExecutionContext) {

  private def categoryToDto(c: Category): CategoryDTO = {
    //TODO Implement tree stuff
    CategoryDTO(c.id, c.name, c.account_type, c.priority, None, Seq.empty)
  }

  private def dtoToCategory(dto: CategoryDTO): Category =
    Category(dto.id, dto.account_type, dto.name, dto.priority)

  def create(dto: Option[CategoryDTO]): ErrorF[CategoryDTO] = {
    val validDto = dto.fromOption("CATEGORY_DATA_INVALID")

    validDto.map(dtoToCategory).map(CategoryQuery.insert).map(sql.query).transform.map(categoryToDto)
  }

  def list(): Future[Seq[CategoryDTO]] = sql.query(CategoryQuery.list).map(_.map(categoryToDto))

  def getCategory(id: Long): ErrorF[Category] = EitherT(sql.query(CategoryQuery.findById(id)).map(_.fromOption("CATEGORY_NOT_FOUND")))

  def get(id: Long): ErrorF[CategoryDTO] = getCategory(id).map(categoryToDto)

  def edit(id: Long, dto: Option[CategoryDTO]): ErrorF[CategoryDTO] = {
    val validDto = dto.fromOption("CATEGORY_DATA_INVALID")
    val newCategory = EitherT(Future.successful(validDto))
      .flatMap(vd => getCategory(id)
        .map(_.copy(name = vd.name, priority = vd.priority)))
    newCategory
      .map(CategoryQuery.update(_).map(_.fromOption("CATEGORY_NOT_FOUND")))
      .flatMapF(sql.query)
      .map(categoryToDto)
  }

  def delete(id: Long): ErrorF[Int] = {
    val query = CategoryQuery.delete(id).map {
      case 1 => 1.right
      case _ => "CATEGORY_NOT_FOUND".left
    }
    EitherT(sql.query(query))
  }
}
