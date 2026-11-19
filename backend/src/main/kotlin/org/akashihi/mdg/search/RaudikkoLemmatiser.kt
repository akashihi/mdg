package org.akashihi.mdg.search

import fi.evident.raudikko.AnalyzerConfiguration
import fi.evident.raudikko.Morphology
import java.util.Locale

/**
 * Finnish lemmatiser. The morphology is shared, the analyser holds mutable buffers and lives once per thread.
 */
class RaudikkoLemmatiser : Lemmatiser {
    private val morphology = Morphology.loadBundled()
    private val analyzer = ThreadLocal.withInitial {
        val configuration = AnalyzerConfiguration()
        configuration.setIncludeBaseFormParts(true)
        configuration.setIncludeStructure(false)
        configuration.setIncludeBasicAttributes(false)
        configuration.setIncludeFstOutput(false)
        configuration.setIncludeOrganizationNameAnalysis(false)
        morphology.newAnalyzer(configuration)
    }

    override fun lemmas(token: String): Lemmas {
        val analyses = analyzer.get().analyze(token)
        if (analyses.isEmpty()) {
            return Lemmas.UNKNOWN
        }
        val whole = analyses.mapNotNull { it.baseForm }.map { it.lowercase(Locale.ROOT) }.toSet()
        val parts = analyses.flatMap { it.baseFormParts ?: emptyList() }.map { it.lowercase(Locale.ROOT) }.toSet() - whole
        return Lemmas(whole = whole, parts = parts, known = true)
    }
}
