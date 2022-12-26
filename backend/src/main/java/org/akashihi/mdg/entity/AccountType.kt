package org.akashihi.mdg.entity

enum class AccountType {
    INCOME, ASSET, EXPENSE;

    fun toDbValue(): String {
        return name.lowercase()
    }

    companion object {
        @JvmStatic
        fun from(status: String): AccountType {
            return valueOf(status.uppercase())
        }
    }
}