package controllers.dto
import controllers.api.IdentifiableObject.LongIdentifiable
import models.AccountType
import play.api.libs.json._
import play.api.libs.functional.syntax._

case class CategoryDTO(
                        id: Option[Long],
                        name: String,
                        account_type: AccountType,
                        priority: Int,
                        parent_id: Option[Long],
                        children: Seq[CategoryDTO]
                      ) extends LongIdentifiable

object CategoryDTO {
  implicit val categoryDtoRead: Reads[CategoryDTO] = (
    (JsPath \ "data" \ "id").readNullable[Long] and
      (JsPath \ "data" \ "attributes" \ "name").read[String] and
      (JsPath \ "data" \ "attributes" \ "account_type").read[String].map(AccountType.apply) and
      (JsPath \ "data" \ "attributes" \ "priority").read[Int] and
      (JsPath \ "data" \ "attributes" \ "parent_id").readNullable[Long] and
      Reads.pure(Seq.empty[CategoryDTO])
    )(CategoryDTO.apply _)

  implicit val categoryDtoWrites: Writes[CategoryDTO] = new Writes[CategoryDTO] {
    override def writes(o: CategoryDTO): JsValue = {
      val j = Json.obj(
        "name" -> o.name,
        "account_type" -> o.account_type.value,
        "priority" -> o.priority
      )

      val parented = o.parent_id.map(p => j ++ Json.obj("parent_id" -> p)).getOrElse(j).copy()

      if (o.children.nonEmpty) {
        parented ++ Json.obj("children" -> o.children)
      } else {
        parented
      }
    }
  }
}
