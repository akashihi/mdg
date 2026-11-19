package org.akashihi.mdg.dao

import org.akashihi.mdg.search.TypoMatcher
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

internal class FuzzyBoundsTest {
    /** Plain Levenshtein, as Postgres computes it: no transposition, so a swap costs two edits. */
    private fun levenshtein(a: String, b: String): Int {
        var prev = IntArray(b.length + 1) { it }
        for (i in 1..a.length) {
            val cur = IntArray(b.length + 1)
            cur[0] = i
            for (j in 1..b.length) {
                cur[j] = minOf(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + if (a[i - 1] == b[j - 1]) 0 else 1)
            }
            prev = cur
        }
        return prev[b.length]
    }

    private fun admitted(typed: String, term: String, k: Int): Boolean {
        val bounds = FuzzyBounds.of(k)
        return Math.abs(typed.length - term.length) <= bounds.lengthSlack && levenshtein(term, typed) <= bounds.levenshtein
    }

    @Test
    fun boundsAreKAndTwoK() {
        Assertions.assertEquals(FuzzyBounds(1, 2), FuzzyBounds.of(1))
        Assertions.assertEquals(FuzzyBounds(2, 4), FuzzyBounds.of(2))
    }

    @Test
    fun prefilterAdmitsTwoTranspositionsAtKTwo() {
        val k = TypoMatcher.maxEdits("rtansatcion")
        Assertions.assertEquals(2, k)
        Assertions.assertEquals(4, levenshtein("transaction", "rtansatcion"))
        Assertions.assertEquals(2, TypoMatcher.distance("rtansatcion", "transaction"))
        Assertions.assertTrue(admitted("rtansatcion", "transaction", k))
    }

    @Test
    fun prefilterStillRejectsFarWords() {
        Assertions.assertFalse(admitted("rtansatcion", "tesla", 2))
        Assertions.assertFalse(admitted("tesla", "income", 1))
    }
}
