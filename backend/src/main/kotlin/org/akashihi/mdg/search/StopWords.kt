package org.akashihi.mdg.search

import org.apache.lucene.analysis.cz.CzechAnalyzer
import org.apache.lucene.analysis.de.GermanAnalyzer
import org.apache.lucene.analysis.en.EnglishAnalyzer
import org.apache.lucene.analysis.fi.FinnishAnalyzer
import org.apache.lucene.analysis.lt.LithuanianAnalyzer
import org.apache.lucene.analysis.ru.RussianAnalyzer

/**
 * Stop words are only ignored in queries, the stored data keeps every word.
 */
object StopWords {
    private val STOP: Set<String> by lazy {
        listOf(
            RussianAnalyzer.getDefaultStopSet(),
            CzechAnalyzer.getDefaultStopSet(),
            GermanAnalyzer.getDefaultStopSet(),
            EnglishAnalyzer.getDefaultStopSet(),
            LithuanianAnalyzer.getDefaultStopSet(),
            FinnishAnalyzer.getDefaultStopSet()
        ).flatMap { set -> set.map { String(it as CharArray) } }.toSet()
    }

    fun isStopWord(word: String): Boolean = STOP.contains(word)

    /** Drops stop words from the query. When nothing would be left, every word is searched as typed. */
    fun filter(words: List<String>): List<String> {
        val kept = words.filter { !isStopWord(it) }
        return kept.ifEmpty { words }
    }
}
