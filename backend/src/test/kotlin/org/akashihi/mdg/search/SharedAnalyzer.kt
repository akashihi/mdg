package org.akashihi.mdg.search

/** Loading all dictionaries takes a couple of seconds, so the tests share one analyzer. */
object SharedAnalyzer {
    val instance: SearchAnalyzer by lazy { SearchAnalyzer() }
}
