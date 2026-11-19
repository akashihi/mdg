package org.akashihi.mdg.search

/**
 * The typo rule. The number of edits tolerated depends on the length of the word the user typed,
 * counted in code points after folding. Words with digits are never matched approximately.
 */
object TypoMatcher {
    const val EXACT_MAX_LENGTH = 3
    const val ONE_EDIT_MAX_LENGTH = 7
    const val ONE_EDIT = 1
    const val TWO_EDITS = 2

    fun maxEdits(typed: String): Int {
        if (TextFolding.hasDigit(typed)) {
            return 0
        }
        val length = TextFolding.length(typed)
        return when {
            length <= EXACT_MAX_LENGTH -> 0
            length <= ONE_EDIT_MAX_LENGTH -> ONE_EDIT
            else -> TWO_EDITS
        }
    }

    fun within(typed: String, candidate: String, maxEdits: Int): Boolean = distance(typed, candidate) <= maxEdits

    /** Optimal string alignment distance: insertions, deletions, substitutions and adjacent transpositions cost one each. */
    fun distance(a: String, b: String): Int {
        val x = a.codePoints().toArray()
        val y = b.codePoints().toArray()
        val d = Array(x.size + 1) { IntArray(y.size + 1) }
        for (i in 0..x.size) d[i][0] = i
        for (j in 0..y.size) d[0][j] = j
        for (i in 1..x.size) {
            for (j in 1..y.size) {
                val cost = if (x[i - 1] == y[j - 1]) 0 else 1
                d[i][j] = minOf(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
                if (i > 1 && j > 1 && x[i - 1] == y[j - 2] && x[i - 2] == y[j - 1]) {
                    d[i][j] = minOf(d[i][j], d[i - 2][j - 2] + 1)
                }
            }
        }
        return d[x.size][y.size]
    }
}
