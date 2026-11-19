package org.akashihi.mdg.search

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

internal class SearchAnalyzerTest {
    private val analyzer = SharedAnalyzer.instance

    private fun terms(text: String) = analyzer.indexTerms(text)

    private fun forms(word: String) = analyzer.queryWords(word).single().forms

    @Test
    fun russianInflectionsShareALemma() {
        Assertions.assertTrue(terms("молока").containsKey("молоко"))
        Assertions.assertTrue(forms("молока").contains("молоко"))
        Assertions.assertTrue(forms("молоко").contains("молоко"))
    }

    @Test
    fun czechInflectionsShareALemma() {
        Assertions.assertTrue(terms("obchodech").containsKey("obchod"))
        Assertions.assertTrue(forms("obchodech").contains("obchod"))
    }

    @Test
    fun surfaceFormIsAlwaysKeptAndFolded() {
        Assertions.assertTrue(terms("Mléko").containsKey("mleko"))
        Assertions.assertTrue(forms("mleko").contains("mleko"))
        Assertions.assertTrue(forms("Straße").contains("strasse"))
    }

    @Test
    fun diacriticsLessWordFindsDiacriticLemma() {
        // a lemma of the stored comment is folded, so the folded query hits it
        Assertions.assertTrue(terms("mléka").containsKey("mleko"))
        Assertions.assertTrue(forms("mleko").contains("mleko"))
    }

    @Test
    fun finnishCompoundPartsAreStoredAsParts() {
        val terms = terms("ruokakaupassa")
        Assertions.assertEquals(true, terms["ruokakauppa"])
        Assertions.assertEquals(false, terms["kauppa"])
        Assertions.assertEquals(false, terms["ruoka"])
    }

    @Test
    fun germanCompoundPartsAreStoredAsParts() {
        val terms = terms("Lebensmittelgeschäft")
        Assertions.assertEquals(false, terms["geschaft"])
        Assertions.assertEquals(false, terms["mittel"])
        Assertions.assertEquals(true, terms["lebensmittelgeschaft"])
    }

    @Test
    fun germanDecompounderRejectsShortRootsAndKnownWords() {
        Assertions.assertFalse(terms("smartstore").containsKey("tor"))
        Assertions.assertFalse(terms("transaction").containsKey("tran"))
        Assertions.assertFalse(terms("internations").containsKey("ion"))
    }

    @Test
    fun queryFormsDoNotIncludeCompoundParts() {
        Assertions.assertFalse(forms("ruokakauppa").contains("kauppa"))
    }

    @Test
    fun onlySuffixAnalysesAreUsed() {
        Assertions.assertFalse(terms("income").containsKey("come"))
        Assertions.assertFalse(forms("income").contains("come"))
        Assertions.assertTrue(terms("income").containsKey("income"))
    }

    @Test
    fun englishInflectionsShareALemma() {
        Assertions.assertTrue(terms("groceries").containsKey("grocery"))
    }

    @Test
    fun wordsWithDigitsAreKeptAsTyped() {
        val t = terms("Paid 22,50 for 2025x")
        Assertions.assertEquals(true, t["22.50"])
        Assertions.assertTrue(t.containsKey("2025x"))
        val word = analyzer.queryWords("22.50").single()
        Assertions.assertEquals(setOf("22.50"), word.forms)
        Assertions.assertEquals(0, word.maxEdits)
        Assertions.assertEquals(terms("22,50").keys, analyzer.queryWords("22,50").single().forms)
    }

    @Test
    fun mixedLanguagesInOneComment() {
        val t = terms("Lidl молоко и obchodech")
        Assertions.assertTrue(t.keys.containsAll(listOf("lidl", "молоко", "obchod")))
    }

    @Test
    fun queryWordsCarryTheTypoBand() {
        val words = analyzer.queryWords("tesla incme transcation")
        Assertions.assertEquals(listOf(1, 1, 2), words.map { it.maxEdits })
        Assertions.assertEquals(listOf("tesla", "incme", "transcation"), words.map { it.typed })
    }

    @Test
    fun emptyTextHasNoTerms() {
        Assertions.assertTrue(terms("").isEmpty())
        Assertions.assertTrue(terms(" , . ").isEmpty())
        Assertions.assertTrue(analyzer.indexTerms(null).isEmpty())
    }
}
