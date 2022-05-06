package org.akashihi.mdg.entity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class BudgetEntryModeTest {

    @Test
    void toDbValue() {
        assertEquals("single", BudgetEntryMode.SINGLE.toDbValue());
        assertEquals("even", BudgetEntryMode.EVEN.toDbValue());
        assertEquals("prorated", BudgetEntryMode.PRORATED.toDbValue());
    }

    @Test
    void from() {
        assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from("single"));
        assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.from("even"));
        assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.from("prorated"));
    }

    @Test
    void testFromBoolean() {
        assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from(false, false));
        assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.from(false, true));
        assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.from(true, false));
        assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.from(true, true));
    }

    @ParameterizedTest
    @CsvSource({
            "false,false,single",
            "false,true,single",
            "true,false,even",
            "true,true,prorated"})
    void testFromEntry(Boolean even, Boolean prorated, String mode) {
        BudgetEntry entry = new BudgetEntry();
        entry.setEvenDistribution(even);
        entry.setProration(prorated);

        assertEquals(BudgetEntryMode.from(mode), BudgetEntryMode.from(entry));
    }

    @Test
    void flatten() {
        assertEquals(BudgetEntryMode.PRORATED, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.PRORATED, BudgetEntryMode.PRORATED)));
        assertEquals(BudgetEntryMode.EVEN, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.EVEN, BudgetEntryMode.PRORATED)));
        assertEquals(BudgetEntryMode.SINGLE, BudgetEntryMode.flatten(Arrays.asList(BudgetEntryMode.PRORATED, BudgetEntryMode.EVEN, BudgetEntryMode.SINGLE)));
    }
}