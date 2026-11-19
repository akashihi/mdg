package org.akashihi.mdg.service

import org.akashihi.mdg.dao.SearchTermDao
import org.akashihi.mdg.dao.TagRepository
import org.akashihi.mdg.search.SearchAnalyzer
import org.akashihi.mdg.search.TextFolding
import org.akashihi.mdg.search.TypoMatcher
import org.springframework.stereotype.Service
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.TransactionTemplate

/**
 * Resolved full text part of a transaction filter.
 *
 * @property words one set of acceptable vocabulary term ids for every required comment word
 * @property tagIds acceptable tag ids, null when the filter does not restrict tags
 * @property matchesNothing a required comment word or the whole tag list matched nothing, so no transaction can match
 */
data class SearchCriteria(val words: List<Set<Long>> = emptyList(), val tagIds: Set<Long>? = null, val matchesNothing: Boolean = false)

@Service
open class SearchService(
    private val analyzer: SearchAnalyzer,
    private val searchTermDao: SearchTermDao,
    private val tagRepository: TagRepository,
    transactionManager: PlatformTransactionManager
) {
    private val transactions = TransactionTemplate(transactionManager)

    /** Replaces the search links of a transaction. Runs in the caller's database transaction. */
    open fun store(txId: Long, comment: String?) {
        searchTermDao.replaceLinks(txId, analyzer.indexTerms(comment))
    }

    /**
     * Rebuilds the links of every transaction from its current comment, in batches that each commit on their own.
     * A batch reads its rows inside its own transaction and keeps them locked until it commits, see [SearchTermDao.commentsAfter].
     */
    open fun reindexAll() {
        transactions.executeWithoutResult { searchTermDao.deleteAllLinks() }
        var lastId = 0L
        while (true) {
            val after = lastId
            val last = transactions.execute {
                val batch = searchTermDao.commentsAfter(after, REINDEX_BATCH)
                if (batch.isEmpty()) {
                    null
                } else {
                    searchTermDao.replaceLinksBatch(batch.associate { it.id to analyzer.indexTerms(it.comment) })
                    batch.last().id
                }
            } ?: return
            lastId = last
        }
    }

    /** Translates the `comment` and `tag` members of a transaction filter into vocabulary and tag ids. */
    open fun resolve(filter: Map<String, String>): SearchCriteria {
        val words = ArrayList<Set<Long>>()
        for (word in analyzer.queryWords(filter["comment"])) {
            val ids = termIds(word.forms, word.typed, word.maxEdits)
            if (ids.isEmpty()) {
                return SearchCriteria(matchesNothing = true)
            }
            words.add(ids)
        }
        var tagIds: Set<Long>? = null
        val names = parseTagList(filter["tag"])
        if (names.isNotEmpty()) {
            tagIds = matchingTags(names)
            if (tagIds.isEmpty()) {
                return SearchCriteria(matchesNothing = true)
            }
        }
        return SearchCriteria(words, tagIds)
    }

    private fun termIds(forms: Set<String>, typed: String, maxEdits: Int): Set<Long> {
        val ids = HashSet(searchTermDao.exactTermIds(forms))
        if (maxEdits > 0 && typed.length <= MAX_FUZZY_LENGTH) {
            searchTermDao.fuzzyCandidates(typed, maxEdits).forEach { (id, term) ->
                if (TypoMatcher.within(typed, term, maxEdits)) {
                    ids.add(id)
                }
            }
        }
        return ids
    }

    private fun matchingTags(names: List<String>): Set<Long> {
        val wanted = names.map(::normalizeTag)
        val ids = HashSet<Long>()
        for (tag in tagRepository.findAll()) {
            val stored = normalizeTag(tag.tag)
            if (wanted.any { stored == it || TypoMatcher.within(it, stored, TypoMatcher.maxEdits(it)) }) {
                ids.add(tag.id!!)
            }
        }
        return ids
    }

    companion object {
        const val REINDEX_BATCH = 500
        private const val MAX_FUZZY_LENGTH = 255

        /** Tag names are compared like search words: folded, and with a decimal comma equal to a point in number-like names. */
        fun normalizeTag(name: String): String {
            val folded = TextFolding.fold(name.trim().lowercase())
            return if (TextFolding.hasDigit(folded)) TextFolding.normalizeNumber(folded) else folded
        }

        /** Either one tag name or a bracketed comma separated list `[a,b]`. Names are trimmed, empty ones dropped. */
        fun parseTagList(value: String?): List<String> {
            val trimmed = value?.trim() ?: return emptyList()
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                return trimmed.substring(1, trimmed.length - 1).split(",").map { it.trim() }.filter { it.isNotEmpty() }
            }
            return if (trimmed.isEmpty()) emptyList() else listOf(trimmed)
        }
    }
}
