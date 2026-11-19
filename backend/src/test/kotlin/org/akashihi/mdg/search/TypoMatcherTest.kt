package org.akashihi.mdg.search

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

internal class TypoMatcherTest {
    @Test
    fun bandsFollowTheTypedLength() {
        Assertions.assertEquals(0, TypoMatcher.maxEdits("abc"))
        Assertions.assertEquals(1, TypoMatcher.maxEdits("abcd"))
        Assertions.assertEquals(1, TypoMatcher.maxEdits("abcdefg"))
        Assertions.assertEquals(2, TypoMatcher.maxEdits("abcdefgh"))
    }

    @Test
    fun lengthIsCountedInCodePoints() {
        Assertions.assertEquals(0, TypoMatcher.maxEdits("мол"))
        Assertions.assertEquals(1, TypoMatcher.maxEdits("молк"))
        Assertions.assertEquals(2, TypoMatcher.maxEdits("a😀bcdefg"))
    }

    @Test
    fun digitsAreExactOnly() {
        Assertions.assertEquals(0, TypoMatcher.maxEdits("20250101"))
        Assertions.assertEquals(0, TypoMatcher.maxEdits("22.50"))
        Assertions.assertFalse(TypoMatcher.within("2025", "2024", TypoMatcher.maxEdits("2025")))
    }

    @Test
    fun transpositionIsOneEdit() {
        Assertions.assertEquals(1, TypoMatcher.distance("prisma", "prsima"))
        Assertions.assertEquals(1, TypoMatcher.distance("transaction", "transcation"))
        Assertions.assertEquals(2, TypoMatcher.distance("abcd", "badc"))
    }

    @Test
    fun plainEdits() {
        Assertions.assertEquals(1, TypoMatcher.distance("incme", "income"))
        Assertions.assertEquals(1, TypoMatcher.distance("молако", "молоко"))
        Assertions.assertEquals(0, TypoMatcher.distance("same", "same"))
        Assertions.assertEquals(4, TypoMatcher.distance("", "abcd"))
    }

    @Test
    fun matchesWithinTheBand() {
        Assertions.assertTrue(TypoMatcher.within("incme", "income", TypoMatcher.maxEdits("incme")))
        Assertions.assertTrue(TypoMatcher.within("молако", "молоко", TypoMatcher.maxEdits("молако")))
        Assertions.assertTrue(TypoMatcher.within("prsima", "prisma", TypoMatcher.maxEdits("prsima")))
        Assertions.assertFalse(TypoMatcher.within("tesla", "test", TypoMatcher.maxEdits("tesla")))
        Assertions.assertFalse(TypoMatcher.within("abc", "abd", TypoMatcher.maxEdits("abc")))
        Assertions.assertTrue(TypoMatcher.within("transaktions", "transactions", TypoMatcher.maxEdits("transaktions")))
        Assertions.assertFalse(TypoMatcher.within("transaktiens", "transactions", 1))
    }
}
