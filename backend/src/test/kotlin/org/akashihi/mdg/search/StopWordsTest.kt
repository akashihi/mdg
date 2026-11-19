package org.akashihi.mdg.search

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

internal class StopWordsTest {
    @Test
    fun stopWordsOfEveryLanguageAreRecognised() {
        listOf("the", "und", "и", "ir", "ja", "je").forEach { Assertions.assertTrue(StopWords.isStopWord(it), it) }
        Assertions.assertFalse(StopWords.isStopWord("income"))
    }

    @Test
    fun stopWordsAreDropped() {
        Assertions.assertEquals(listOf("lidl"), StopWords.filter(listOf("the", "lidl", "и")))
    }

    @Test
    fun onlyStopWordsAreSearchedAsTyped() {
        Assertions.assertEquals(listOf("the", "и"), StopWords.filter(listOf("the", "и")))
    }

    @Test
    fun queryWordsApplyTheFallback() {
        val analyzer = SharedAnalyzer.instance
        Assertions.assertEquals(listOf("lidl"), analyzer.queryWords("The Lidl").map { it.typed })
        Assertions.assertEquals(listOf("the", "и"), analyzer.queryWords("The и").map { it.typed })
        Assertions.assertTrue(analyzer.queryWords("   ,. ").isEmpty())
    }
}
