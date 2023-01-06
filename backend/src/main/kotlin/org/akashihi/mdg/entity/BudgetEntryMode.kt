package org.akashihi.mdg.entity

enum class BudgetEntryMode {
    SINGLE, EVEN, PRORATED;

    fun toDbValue(): String {
        return name.lowercase()
    }

    companion object {
        fun from(status: String): BudgetEntryMode {
            return valueOf(status.uppercase())
        }

        fun from(even: Boolean, prorated: Boolean): BudgetEntryMode {
            return if (even && prorated) {
                PRORATED
            } else if (even) {
                EVEN
            } else {
                SINGLE
            }
        }

        fun flatten(modes: Collection<BudgetEntryMode>?): BudgetEntryMode {
            val presence = HashSet(modes)
            return if (!presence.contains(EVEN) && !presence.contains(SINGLE)) {
                PRORATED
            } else if (!presence.contains(SINGLE)) {
                EVEN
            } else {
                SINGLE
            }
        }
    }
}
