package org.akashihi.mdg.api.v1

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.api.util.CursorHelper
import org.akashihi.mdg.api.v1.filtering.Embedding
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.service.BudgetService
import org.akashihi.mdg.service.CategoryService
import org.akashihi.mdg.service.RateService
import org.akashihi.mdg.service.SettingService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.util.*

data class BudgetCursor(
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val limit: Int?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL)  val pointer: Long?
)
data class BudgetEntryTreeEntry(
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val id: Long?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val name: String?,
    @field:JsonProperty("actual_amount") val actualAmount: BigDecimal,
    @field:JsonProperty("expected_amount") val expectedAmount: BigDecimal,
    @field:JsonProperty("allowed_spendings") val allowedSpendings: BigDecimal,
    @field:JsonProperty("spending_percent")  val spendingPercent: BigDecimal,
    val entries: Collection<BudgetEntry>,
    val categories: Collection<BudgetEntryTreeEntry>
)

data class BudgetEntryTree(val expense: BudgetEntryTreeEntry, val income: BudgetEntryTreeEntry)

data class Budgets(val budgets: Collection<Budget>, val self: String, val first: String, val next: String, val left: Long)

data class BudgetEntries(@field:JsonProperty("budget_entries") val budgetEntries: Collection<BudgetEntry>)

@RestController
open class BudgetController(private val budgetService: BudgetService, private val categoryService: CategoryService, private val rateService: RateService, private val settingService: SettingService, private val cursorHelper: CursorHelper) {
    private fun getEntryTotals(f: (BudgetEntry) -> BigDecimal, entries: Collection<BudgetEntry>): BigDecimal {
        val currentPrimaryCurrency = settingService.currentCurrencyPrimary()
        return entries.map { e: BudgetEntry ->
            var amount = f(e)
            if (currentPrimaryCurrency?.let { it == e.account?.currency } == false) {
                val rate = e.account?.currency?.let { rateService.getCurrentRateForPair(it, currentPrimaryCurrency) }
                rate?.also { amount = amount.multiply(it.rate) }
            }
            amount
        }.fold(BigDecimal.ZERO) { acc: BigDecimal, v: BigDecimal? -> acc.add(v) }
    }

    private fun convertTopCategory(accountType: AccountType, categories: Collection<Category>, entries: Collection<BudgetEntry>, embed: Collection<String>?): BudgetEntryTreeEntry {
        val enrichedEntries = entries.map { it.account?.apply {
            this.balance=BigDecimal.ZERO
            this.primaryBalance=BigDecimal.ZERO
        }
            it
        }.toList()
        val topEntries = enrichedEntries.filter { it.account?.accountType == accountType }
            .filter { it.account?.category == null }
            .map(Embedding.embedBudgetEntryObject(embed))
            .toList()
        val topCategories = categories.filter { it.accountType == accountType }
            .mapNotNull { convertCategory(it, enrichedEntries, embed) }
            .toList()
        val actualSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::actualAmount, topCategories)
        val expectedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, topCategories)
        val allowedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, topCategories)
        val percent = BudgetService.getSpendingPercent(actualSpendingsCategories, expectedSpendingsCategories)
        return BudgetEntryTreeEntry(null, null, actualSpendingsCategories, expectedSpendingsCategories, percent, allowedSpendingsCategories, topEntries, topCategories)
    }

    private fun convertCategory(category: Category, entries: Collection<BudgetEntry>, embed: Collection<String>?): BudgetEntryTreeEntry? {
        val categoryEntries = entries.filter { it.account?.category != null }.filter { it.account?.category == category }.map(Embedding.embedBudgetEntryObject(embed)).toList()
        val subCategories = category.children.mapNotNull { c: Category -> convertCategory(c, entries, embed) }.toList()
        if (categoryEntries.isEmpty() && subCategories.isEmpty()) {
            return null
        }
        val actualSpendings = getEntryTotals({ obj: BudgetEntry -> obj.actualAmount }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::actualAmount, subCategories))
        val expectedSpendings = getEntryTotals({ obj: BudgetEntry -> obj.expectedAmount }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, subCategories))
        val allowedSpendings = getEntryTotals({ obj: BudgetEntry -> obj.allowedSpendings }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, subCategories))
        val percent = BudgetService.getSpendingPercent(actualSpendings, expectedSpendings)
        return BudgetEntryTreeEntry(category.id, category.name, actualSpendings, expectedSpendings, allowedSpendings, percent, categoryEntries, subCategories)
    }

    @PostMapping(value = ["/budgets"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody budget: Budget): Budget = budgetService.create(budget)

    @GetMapping(value = ["/budgets"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(@RequestParam("limit") limit: Int?, @RequestParam("cursor") cursor: String?): Budgets {
        val budgetCursor = cursor?.let { cursorHelper.cursorFromString(it, BudgetCursor::class.java) } ?: BudgetCursor(limit, null)
        val budgets = budgetService.list(budgetCursor.limit, budgetCursor.pointer)
        val self = cursorHelper.cursorToString(budgetCursor) ?: ""
        var first: String = ""
        var next: String = ""
        if (limit != null || cursor != null) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            val firstCursor = BudgetCursor(budgetCursor.limit, 0L)
            first = cursorHelper.cursorToString(firstCursor) ?: ""
            next = if (budgets.items.isEmpty() || budgets.left == 0L) {
                "" //We may have no items at all or no items left, so no need to find next cursor
            } else {
                val nextCursor = BudgetCursor(budgetCursor.limit, budgets.items[budgets.items.size - 1].id)
                cursorHelper.cursorToString(nextCursor) ?: ""
            }
        }
        return Budgets(budgets.items, self, first, next, budgets.left)
    }

    @GetMapping(value = ["/budgets/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long): Budget = budgetService[id] ?: throw MdgException("BUDGET_NOT_FOUND")

    @PutMapping(value = ["/budgets/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long, @RequestBody budget: Budget): Budget = budgetService.update(id, budget) ?: throw MdgException("BUDGET_NOT_FOUND")

    @DeleteMapping("/budgets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long) = budgetService.delete(id)

    @GetMapping(value = ["/budgets/{budgetId}/entries"], produces = ["application/vnd.mdg+json;version=1"])
    fun listEntries(@PathVariable("budgetId") budgetId: Long, @RequestParam("embed") embed: Collection<String>?): BudgetEntries = BudgetEntries(budgetService.listEntries(budgetId).stream().map(Embedding.embedBudgetEntryObject(embed)).toList())

    @GetMapping(value = ["/budgets/{budgetId}/entries/tree"], produces = ["application/vnd.mdg+json;version=1"])
    fun tree(@PathVariable("budgetId") budgetId: Long, @RequestParam("embed") embed: Collection<String>?, @RequestParam("filter") filter: String?): BudgetEntryTree {
        budgetService[budgetId] ?: throw MdgException("BUDGET_NOT_FOUND")
        val categories = categoryService.list()
        var entries = budgetService.listEntries(budgetId)
        val leaveEmpty = filter?.let { "all".equals(it, ignoreCase = true) } ?: false
        if (!leaveEmpty) {
            entries = entries.filter { e: BudgetEntry -> !(e.actualAmount.compareTo(BigDecimal.ZERO) == 0 && e.expectedAmount.compareTo(BigDecimal.ZERO) == 0) }.toList()
        }
        val expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, entries, embed)
        val incomeEntry = convertTopCategory(AccountType.INCOME, categories, entries, embed)
        return BudgetEntryTree(expenseEntry, incomeEntry)
    }

    @GetMapping(value = ["/budgets/{budgetId}/entries/{entryId}"], produces = ["application/vnd.mdg+json;version=1"])
    fun getEntry(@Suppress("UNUSED_PARAMETER") @PathVariable("budgetId") budgetId: Long, @PathVariable("entryId") entryId: Long, @RequestParam("embed") embed: Collection<String>?): BudgetEntry = budgetService.getBudgetEntry(entryId)?.let(Embedding.embedBudgetEntryObject(embed)) ?: throw MdgException("BUDGETENTRY_NOT_FOUND")

    @PutMapping(value = ["/budgets/{budgetId}/entries/{entryId}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateEntry(@Suppress("UNUSED_PARAMETER") @PathVariable("budgetId") budgetId: Long, @PathVariable("entryId") entryId: Long, @RequestBody entry: BudgetEntry): BudgetEntry = budgetService.updateBudgetEntry(entryId, entry)?.let(Embedding.embedBudgetEntryObject(null)) ?: throw MdgException("BUDGETENTRY_NOT_FOUND")

    companion object {
        protected fun getCategoryTotals(f: (BudgetEntryTreeEntry) -> BigDecimal, entries: Collection<BudgetEntryTreeEntry>): BigDecimal {
            return entries.map{f(it)}.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        }
    }
}