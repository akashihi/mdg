package org.akashihi.mdg.service

import org.akashihi.mdg.dao.SearchTermDao
import org.akashihi.mdg.dao.TagRepository
import org.akashihi.mdg.dao.TxComment
import org.akashihi.mdg.search.SearchAnalyzer
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.inOrder
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.transaction.PlatformTransactionManager

internal class SearchServiceTest {
    @Test
    fun singleTagName() {
        Assertions.assertEquals(listOf("income"), SearchService.parseTagList("income"))
        Assertions.assertEquals(listOf("two words"), SearchService.parseTagList("  two words "))
    }

    @Test
    fun bracketedList() {
        Assertions.assertEquals(listOf("a", "b"), SearchService.parseTagList("[a,b]"))
        Assertions.assertEquals(listOf("a", "b c"), SearchService.parseTagList(" [ a , b c ] "))
    }

    @Test
    fun emptyListsYieldNoNames() {
        listOf(null, "", "   ", "[]", "[ , ]", "[,]").forEach { Assertions.assertTrue(SearchService.parseTagList(it).isEmpty(), it) }
    }

    @Test
    fun withoutBracketsACommaStaysInTheName() {
        Assertions.assertEquals(listOf("a,b"), SearchService.parseTagList("a,b"))
    }

    @Test
    fun tagNamesAreFoldedAndNumbersNormalised() {
        Assertions.assertEquals("cafe", SearchService.normalizeTag(" Café "))
        Assertions.assertEquals("22.50", SearchService.normalizeTag("22,50"))
    }

    @Test
    fun reindexReadsAndWritesEveryBatchInsideItsOwnTransaction() {
        val dao = mock<SearchTermDao>()
        val analyzer = mock<SearchAnalyzer>()
        val manager = mock<PlatformTransactionManager>()
        whenever(analyzer.indexTerms(anyOrNull())).thenReturn(mapOf("a" to true))
        whenever(dao.commentsAfter(0L, SearchService.REINDEX_BATCH)).thenReturn(listOf(TxComment(1, "x"), TxComment(2, null)))
        whenever(dao.commentsAfter(2L, SearchService.REINDEX_BATCH)).thenReturn(emptyList())

        SearchService(analyzer, dao, mock<TagRepository>(), manager).reindexAll()

        val order = inOrder(manager, dao)
        // delete of all links: its own transaction
        order.verify(manager).getTransaction(anyOrNull())
        order.verify(dao).deleteAllLinks()
        order.verify(manager).commit(anyOrNull())
        // batch: begin, locked read, write, commit
        order.verify(manager).getTransaction(anyOrNull())
        order.verify(dao).commentsAfter(0L, SearchService.REINDEX_BATCH)
        order.verify(dao).replaceLinksBatch(mapOf(1L to mapOf("a" to true), 2L to mapOf("a" to true)))
        order.verify(manager).commit(anyOrNull())
        // the empty batch is read inside a transaction as well
        order.verify(manager).getTransaction(anyOrNull())
        order.verify(dao).commentsAfter(2L, SearchService.REINDEX_BATCH)
        verify(manager, times(3)).getTransaction(anyOrNull())
    }
}
