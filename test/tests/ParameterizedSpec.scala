package tests

import org.scalatest._
import org.scalatest.prop._
import org.scalatest.words.ShouldVerb

abstract class ParameterizedSpec extends PropSpec  with Matchers with OptionValues with TableDrivenPropertyChecks
