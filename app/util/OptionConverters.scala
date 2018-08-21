package util

import scala.util.Try

/**
  * Collection of String to Option[T] converters.
  */
object OptionConverters {

  /**
    * Converts String to Option[Int]
    * @param s string to convert
    */
  implicit class StringOptionInt(val s: String) extends AnyVal {
    def tryToInt: Option[Int] = Try(s.toInt) toOption
    def tryToLong: Option[Long] = Try(s.toLong) toOption
    def tryToBool: Option[Boolean] = Try(s.toBoolean) toOption
  }
}
