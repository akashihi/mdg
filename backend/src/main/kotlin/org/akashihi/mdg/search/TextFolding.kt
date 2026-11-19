package org.akashihi.mdg.search

import org.apache.lucene.analysis.LowerCaseFilter
import org.apache.lucene.analysis.standard.StandardTokenizer
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute
import java.io.StringReader
import java.text.Normalizer

/**
 * Text helpers shared by the indexing and the query side, so both always produce the same terms.
 * Nothing is folded in the database: stored terms and query words go through [fold].
 */
object TextFolding {
    private val MARKS = Regex("\\p{M}+")

    /** Strip diacritics (NFD without combining marks) and map the German sharp s to "ss". */
    fun fold(text: String): String = MARKS.replace(Normalizer.normalize(text, Normalizer.Form.NFD), "").replace("ß", "ss")

    fun hasDigit(text: String): Boolean = text.any { it.isDigit() }

    /** Number-like words are matched exactly, where a decimal comma and a decimal point are the same thing. */
    fun normalizeNumber(text: String): String = text.replace(',', '.')

    /** Length in code points, which is what the typo rule measures. */
    fun length(text: String): Int = text.codePointCount(0, text.length)

    /** Splits a text into lower cased words at spaces and punctuation (UAX#29 word boundaries). */
    fun tokenize(text: String): List<String> {
        val out = ArrayList<String>()
        val tokenizer = StandardTokenizer()
        tokenizer.setReader(StringReader(text))
        LowerCaseFilter(tokenizer).use { stream ->
            val term = stream.addAttribute(CharTermAttribute::class.java)
            stream.reset()
            while (stream.incrementToken()) {
                out.add(term.toString())
            }
            stream.end()
        }
        return out
    }
}
