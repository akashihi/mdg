package tests

import org.scalatest._
import org.scalatest.prop._

abstract class ParameterizedSpec extends PropSpec  with Matchers with OptionValues with TableDrivenPropertyChecks
