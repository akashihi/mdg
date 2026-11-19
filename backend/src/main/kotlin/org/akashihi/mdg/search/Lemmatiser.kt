package org.akashihi.mdg.search

/**
 * Forms of one word as reported by one engine.
 *
 * @property whole the word's own lemmas. Typos are matched against these.
 * @property parts compound parts, found only when typed correctly.
 * @property known whether the engine recognises the word at all.
 */
data class Lemmas(val whole: Set<String> = emptySet(), val parts: Set<String> = emptySet(), val known: Boolean = false) {
    companion object {
        val UNKNOWN = Lemmas()
    }
}

/** Turns one lower cased token into its lemmas. Implementations are shared between threads. */
interface Lemmatiser {
    fun lemmas(token: String): Lemmas
}
