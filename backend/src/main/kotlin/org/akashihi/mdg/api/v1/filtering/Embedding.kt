package org.akashihi.mdg.api.v1.filtering

import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.Operation

object Embedding {
    fun embedOperationObjects(embed: Collection<String>?): (o: Operation) -> Operation {
        val accounts = embed?.contains("account") ?: false
        return { operation: Operation ->
            if (!accounts) {
                operation.account = null
            } else {
                operation.account = embedAccountObjects(embed).invoke(operation.account!!)
            }
            operation
        }
    }

    fun embedAccountObjects(embed: Collection<String>?): (a: Account) -> Account {
        val categories = embed?.contains("category") ?: false
        val currencies = embed?.contains("currency") ?: false
        return { account: Account ->
            // In case a list of accounts is processed, blindly setting a currency id may cause an issue,
            // when same account is on the list for more than one time. As instance of the same account
            // is referenced multiple times, first visit to that reference will set categoryId and
            // remove category if requested. Next visit will assume, that category is still there
            // and it will cause NPE. To avoid such situations a simple check was added:
            // if currency id is set, we know, that accounts was already visited and there is no need
            // to reprocess.
            if (!currencies) {
                account.currency = null
            }
            if (account.category != null) {
                if (!categories) {
                    account.category = null
                }
            }
            account
        }
    }

    fun embedBudgetEntryObject(embed: Collection<String>?): (be: BudgetEntry) -> BudgetEntry {
        val accounts = embed?.contains("account") ?: false
        val categories = embed?.contains("category") ?: false
        return { entry: BudgetEntry ->
            if (entry.account?.category != null) {
                if (categories) {
                    entry.category = entry.account!!.category
                }
            }
            if (!accounts) {
                entry.account = null
            } else {
                entry.account = entry.account?.let { embedAccountObjects(embed).invoke(it) }
            }
            entry
        }
    }
}
