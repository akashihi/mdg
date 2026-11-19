package org.akashihi.mdg.search

import org.apache.lucene.analysis.hunspell.Dictionary
import org.apache.lucene.analysis.hunspell.Hunspell
import java.util.Locale

/**
 * Hunspell lemmatiser for one language. The immutable [Dictionary] is shared, the [Hunspell] instance
 * keeps scratch buffers and so lives once per thread. Only analyses without a prefix are used, so that
 * `income` is never reduced to `come`.
 */
class HunspellLemmatiser(dictionary: Dictionary) : Lemmatiser {
    private val hunspell = ThreadLocal.withInitial { Hunspell(dictionary) }

    override fun lemmas(token: String): Lemmas {
        val analyses = hunspell.get().analyzeSimpleWord(token)
        if (analyses.isEmpty()) {
            return Lemmas.UNKNOWN
        }
        val stems = analyses.filter { it.prefixes.isEmpty() }.map { it.dictEntry.stem.lowercase(Locale.ROOT) }.toSet()
        return Lemmas(whole = stems, known = true)
    }

    /** Dictionary roots of a word, prefixes allowed. Used to validate the parts of a compound. */
    fun roots(word: String): List<String> = hunspell.get().getRoots(word).map { it.lowercase(Locale.ROOT) }
}
