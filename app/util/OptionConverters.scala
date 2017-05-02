package util

import scala.util.Try

object OptionConverters {
  implicit class StringOptionConvert(val s: String) extends AnyVal {
    def tryToInt() = Try(s.toInt) toOption
  }
}
