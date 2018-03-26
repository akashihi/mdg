package dao.mappers

import java.sql.{Date, Timestamp}
import java.time.{LocalDate, LocalDateTime}

import slick.driver.PostgresDriver.api._

/**
  * Created by dchaplyg on 9/20/17.
  */
object LocalDateMapper {
  implicit val localDTtoDate = MappedColumnType.base[LocalDateTime, Timestamp](
    l => Timestamp.valueOf(l),
    d => d.toLocalDateTime
  )

  implicit val localDtoDate = MappedColumnType.base[LocalDate, Date](
    l => Date.valueOf(l),
    d => d.toLocalDate
  )
}
