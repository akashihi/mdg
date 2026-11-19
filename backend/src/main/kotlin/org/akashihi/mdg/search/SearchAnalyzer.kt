package org.akashihi.mdg.search

import org.apache.lucene.analysis.hunspell.Dictionary
import org.apache.lucene.analysis.hunspell.SortingStrategy
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

/**
 * One word of a search query.
 *
 * @property typed the typed word, folded
 * @property forms the folded surface form and lemmas, which are looked up exactly
 * @property maxEdits typo tolerance of the typed word
 */
data class QueryWord(val typed: String, val forms: Set<String>, val maxEdits: Int)

/**
 * Turns text into search terms. Every token goes through every engine and the union of the answers is kept,
 * there is no language detection. Loaded once at startup, shared between threads.
 */
@Component
class SearchAnalyzer(private val engines: List<Lemmatiser>, private val decompounder: Lemmatiser) {
    constructor() : this(load())

    private constructor(loaded: Pair<List<Lemmatiser>, Lemmatiser>) : this(loaded.first, loaded.second)

    /** Term -> whether it is a whole word (a surface form or a full lemma), as opposed to a compound part only. */
    fun indexTerms(text: String?): Map<String, Boolean> {
        val terms = LinkedHashMap<String, Boolean>()
        for (token in TextFolding.tokenize(text ?: "")) {
            val forms = analyze(token)
            forms.whole.forEach { terms[it] = true }
            forms.parts.forEach { terms.putIfAbsent(it, false) }
        }
        return terms
    }

    /** The words to look up for a query, with stop words removed (all of them if only stop words were typed). */
    fun queryWords(text: String?): List<QueryWord> {
        val tokens = StopWords.filter(TextFolding.tokenize(text ?: "").distinct())
        return tokens.map {
            val forms = analyze(it).whole
            val typed = if (TextFolding.hasDigit(it)) TextFolding.normalizeNumber(TextFolding.fold(it)) else TextFolding.fold(it)
            QueryWord(typed, forms + typed, TypoMatcher.maxEdits(typed))
        }.distinctBy { it.typed }
    }

    private fun analyze(token: String): Lemmas {
        if (TextFolding.hasDigit(token)) {
            return Lemmas(whole = setOf(TextFolding.normalizeNumber(TextFolding.fold(token))))
        }
        val results = engines.map { it.lemmas(token) }.toMutableList()
        if (results.none { it.known }) {
            results.add(decompounder.lemmas(token))
        }
        val whole = results.flatMap { it.whole }.map(TextFolding::fold).toMutableSet()
        whole.add(TextFolding.fold(token))
        val parts = results.flatMap { it.parts }.map(TextFolding::fold).toSet() - whole
        return Lemmas(whole = whole, parts = parts)
    }

    companion object {
        private val DICTIONARIES = listOf("ru_RU/ru_RU", "cs_CZ/cs_CZ", "de/de_DE_frami", "en/en_US", "lt_LT/lt")

        private fun load(): Pair<List<Lemmatiser>, Lemmatiser> {
            val hunspell = DICTIONARIES.map { HunspellLemmatiser(loadDictionary(it)) }
            val german = hunspell[DICTIONARIES.indexOf("de/de_DE_frami")]
            return Pair(hunspell + RaudikkoLemmatiser(), GermanDecompounder(german))
        }

        private fun loadDictionary(name: String): Dictionary {
            val aff = ClassPathResource("dictionaries/$name.aff").inputStream
            val dic = ClassPathResource("dictionaries/$name.dic").inputStream
            aff.use { a -> dic.use { d -> return Dictionary(a, listOf(d), true, SortingStrategy.inMemory()) } }
        }
    }
}
