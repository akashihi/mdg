package org.akashihi.mdg.search

/**
 * Splits German compounds using the German Hunspell dictionary as the word oracle. Parts need at least
 * [MIN_PART] letters, a linking -s/-es/-n/-en is allowed, the split with the fewest parts wins and a split
 * is rejected when any resulting root is shorter than [MIN_PART] (`smartstore` is not `smart` + `tor`).
 */
class GermanDecompounder(private val german: HunspellLemmatiser) : Lemmatiser {
    override fun lemmas(token: String): Lemmas {
        if (token.length > MAX_WORD || token.length < 2 * MIN_PART) {
            return Lemmas.UNKNOWN
        }
        val roots = split(token)
        if (roots.size < 2 || roots.any { it.length < MIN_PART }) {
            return Lemmas.UNKNOWN
        }
        return Lemmas(parts = roots.toSet())
    }

    private fun split(word: String): List<String> {
        val n = word.length
        val best = arrayOfNulls<List<String>>(n + 1)
        best[0] = emptyList()
        for (i in 0 until n) {
            val head = best[i] ?: continue
            for (j in n downTo i + MIN_PART) {
                val part = word.substring(i, j)
                val root = rootOf(part, j < n) ?: continue
                val candidate = head + root
                val current = best[j]
                if (current == null || current.size > candidate.size) {
                    best[j] = candidate
                }
            }
        }
        return best[n] ?: emptyList()
    }

    private fun rootOf(part: String, linkAllowed: Boolean): String? {
        german.roots(part).firstOrNull()?.let { return it }
        if (linkAllowed) {
            for (link in LINKS) {
                if (part.endsWith(link) && part.length - link.length >= MIN_PART) {
                    german.roots(part.substring(0, part.length - link.length)).firstOrNull()?.let { return it }
                }
            }
        }
        return null
    }

    companion object {
        const val MIN_PART = 4
        const val MAX_WORD = 40
        private val LINKS = listOf("s", "es", "n", "en")
    }
}
