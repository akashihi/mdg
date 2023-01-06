package org.akashihi.mdg.entity

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import java.util.*

internal class BudgetEntryModeTest {
    @Test
    fun toDbValue() {
        Assertions.assertEquals("single", BudgetEntryMode.SINGLE.toDbValue())
        Assertions.assertEquals("even", BudgetEntryMode.EVEN.toDbValue())
        Assertions.assertEquals("prorated", BudgetEntryMode.PRORATED.toDbValue())
    }

    @Test
    fun from() {
        Assertions.assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from("single"))
        Assertions.assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.from("even"))
        Assertions.assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.from("prorated"))
    }

    @Test
    fun testFromBoolean() {
        Assertions.assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from(false, false))
        Assertions.assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from(false, true))
        Assertions.assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.from(true, false))
        Assertions.assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.from(true, true))
    }

    @ParameterizedTest
    @CsvSource("false,false,single", "false,true,single", "true,false,even", "true,true,prorated")
    fun testFromEntry(even: Boolean, prorated: Boolean, mode: String) {
        Assertions.assertEquals(BudgetEntryMode.from(mode), BudgetEntryMode.from(even, prorated))
    }

    @Test
    fun flatten() {
        Assertions.assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.PRORATED, BudgetEntryMode.PRORATED)))
        Assertions.assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.EVEN, BudgetEntryMode.PRORATED)))
        Assertions.assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.EVEN, BudgetEntryMode.SINGLE)))
    }
}