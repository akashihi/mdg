package services

import dao.tables.Errors
import models.Error
import slick.driver.PostgresDriver.api._

import play.api.libs.concurrent.Execution.Implicits._

/**
  * Error processing facility.
  */
object ErrorService {

  val errors = TableQuery[Errors]

  def getErrorFor(code: String): DBIO[Error] = {
    errors
      .filter(_.code === code)
      .result
      .headOption
      .map {
        case Some(x) => x
        case None =>
          Error(code,
                "500",
                "Unknown error occurred",
                Some("This error code have no description in the database"))
      }
  }
}
