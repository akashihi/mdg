package org.akashihi.mdg.dao

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository
import java.util.TreeMap

data class TxComment(val id: Long, val comment: String?)

/**
 * Plain JDBC access to the search vocabulary. It joins the transaction of the caller, so the links are written
 * in the same database transaction as the `tx` row.
 */
@Repository
class SearchTermDao(private val jdbc: NamedParameterJdbcTemplate) {

    fun replaceLinks(txId: Long, terms: Map<String, Boolean>) {
        jdbc.queryForList("SELECT id FROM tx WHERE id = :tx FOR NO KEY UPDATE", mapOf("tx" to txId), Long::class.java)
        jdbc.update("DELETE FROM tx_search_term WHERE tx_id = :tx", mapOf("tx" to txId))
        if (terms.isEmpty()) {
            return
        }
        upsertTerms(terms)
        linkTerms(txId, terms.keys)
    }

    fun replaceLinksBatch(rows: Map<Long, Map<String, Boolean>>) {
        val all = TreeMap<String, Boolean>()
        rows.values.forEach { terms -> terms.forEach { (term, whole) -> all.merge(term, whole) { a, b -> a || b } } }
        if (all.isNotEmpty()) {
            upsertTerms(all)
        }
        rows.forEach { (txId, terms) ->
            jdbc.update("DELETE FROM tx_search_term WHERE tx_id = :tx", mapOf("tx" to txId))
            if (terms.isNotEmpty()) {
                linkTerms(txId, terms.keys)
            }
        }
    }

    private fun upsertTerms(terms: Map<String, Boolean>) {
        jdbc.update(
            "INSERT INTO search_term(term, whole) SELECT t, w FROM unnest(:terms::text[], :whole::boolean[]) AS u(t, w) ORDER BY t " +
                "ON CONFLICT (term) DO UPDATE SET whole = TRUE WHERE EXCLUDED.whole AND NOT search_term.whole",
            MapSqlParameterSource("terms", terms.keys.toTypedArray()).addValue("whole", terms.values.toTypedArray())
        )
    }

    private fun linkTerms(txId: Long, terms: Collection<String>) {
        jdbc.update(
            "INSERT INTO tx_search_term(tx_id, term_id) SELECT :tx, id FROM search_term WHERE term = ANY (:terms) ON CONFLICT DO NOTHING",
            MapSqlParameterSource("tx", txId).addValue("terms", terms.toTypedArray())
        )
    }

    fun commentsAfter(afterId: Long, limit: Int): List<TxComment> =
        jdbc.query("SELECT id, comment FROM tx WHERE id > :after ORDER BY id LIMIT :limit FOR NO KEY UPDATE", mapOf("after" to afterId, "limit" to limit)) { rs, _ ->
            TxComment(rs.getLong(1), rs.getString(2))
        }

    fun deleteAllLinks() {
        jdbc.update("DELETE FROM tx_search_term", emptyMap<String, Any>())
    }

    fun exactTermIds(forms: Collection<String>): Set<Long> =
        jdbc.queryForList("SELECT id FROM search_term WHERE term = ANY (:forms)", mapOf("forms" to forms.toTypedArray()), Long::class.java).toSet()

    fun fuzzyCandidates(word: String, maxEdits: Int): Map<Long, String> {
        val bounds = FuzzyBounds.of(maxEdits)
        val sql = "SELECT id, term FROM search_term WHERE whole " +
            "AND length(term) BETWEEN length(:word::text) - :slack AND length(:word::text) + :slack " +
            "AND CASE WHEN length(term) <= 255 THEN public.levenshtein_less_equal(term, :word::text, :lev) END <= :lev"
        val rows = LinkedHashMap<Long, String>()
        jdbc.query(sql, mapOf("word" to word, "slack" to bounds.lengthSlack, "lev" to bounds.levenshtein)) { rs -> rows[rs.getLong(1)] = rs.getString(2) }
        return rows
    }
}

data class FuzzyBounds(val lengthSlack: Int, val levenshtein: Int) {
    companion object {
        fun of(maxEdits: Int) = FuzzyBounds(lengthSlack = maxEdits, levenshtein = 2 * maxEdits)
    }
}
