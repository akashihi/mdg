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
    def tryToInt() = Try(s.toInt) toOption
  }
}
