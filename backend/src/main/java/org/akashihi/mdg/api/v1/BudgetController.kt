package org.akashihi.mdg.api.v1

import lombok.RequiredArgsConstructor
import org.akashihi.mdg.api.util.CursorHelper
import org.akashihi.mdg.api.v1.dto.BudgetCursor
import org.akashihi.mdg.api.v1.dto.BudgetEntries
import org.akashihi.mdg.api.v1.dto.BudgetEntryTree
import org.akashihi.mdg.api.v1.dto.BudgetEntryTreeEntry
import org.akashihi.mdg.api.v1.dto.Budgets
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
import java.util.function.Function

@RestController
@RequiredArgsConstructor
open class BudgetController(private val budgetService: BudgetService, private val categoryService: CategoryService, private val rateService: RateService, private val settingService: SettingService, private val cursorHelper: CursorHelper) {
    private fun getEntryTotals(f: Function<BudgetEntry, BigDecimal>, entries: Collection<BudgetEntry>): BigDecimal {
        val currentPrimaryCurrency = settingService.currentCurrencyPrimary()
        return entries.stream().map { e: BudgetEntry ->
            var amount = f.apply(e)
            if (currentPrimaryCurrency?.let { it == e.account!!.currency } == false) {
                val rate = rateService.getCurrentRateForPair(e.account!!.currency!!, currentPrimaryCurrency)
                amount = amount.multiply(rate.rate)
            }
            amount
        }.reduce(BigDecimal.ZERO) { acc: BigDecimal, v: BigDecimal? -> acc.add(v) }
    }

    private fun convertTopCategory(accountType: AccountType, categories: Collection<Category>, entries: Collection<BudgetEntry>, embed: Collection<String>?): BudgetEntryTreeEntry {
        val enrichedEntries = entries.stream().peek { e: BudgetEntry ->
            e.account!!.balance = BigDecimal.ZERO
            e.account!!.primaryBalance = BigDecimal.ZERO
        }.toList()
        val topEntries = enrichedEntries.stream().filter { e: BudgetEntry -> e.account!!.accountType == accountType }
            .filter { e: BudgetEntry -> Objects.isNull(e.account!!.category) }
            .map(Embedding.embedBudgetEntryObject(embed))
            .toList()
        val topCategories = categories.stream().filter { a: Category -> a.accountType == accountType }
            .map { c: Category -> convertCategory(c, enrichedEntries, embed) }.filter { obj: Optional<BudgetEntryTreeEntry> -> obj.isPresent }
            .map { obj: Optional<BudgetEntryTreeEntry> -> obj.get() }.toList()
        val actualSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::actualAmount, topCategories)
        val expectedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, topCategories)
        val allowedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, topCategories)
        val percent = BudgetService.getSpendingPercent(actualSpendingsCategories, expectedSpendingsCategories)
        return BudgetEntryTreeEntry(null, null, actualSpendingsCategories, expectedSpendingsCategories, percent, allowedSpendingsCategories, topEntries, topCategories)
    }

    private fun convertCategory(category: Category, entries: Collection<BudgetEntry>, embed: Collection<String>?): Optional<BudgetEntryTreeEntry> {
        val categoryEntries = entries.stream().filter { e: BudgetEntry -> e.account!!.category != null }.filter { e: BudgetEntry -> e.account!!.category == category }.map(Embedding.embedBudgetEntryObject(embed)).toList()
        val subCategories = category.children.stream().map { c: Category -> convertCategory(c, entries, embed) }
            .filter { obj: Optional<BudgetEntryTreeEntry> -> obj.isPresent }.map { obj: Optional<BudgetEntryTreeEntry> -> obj.get() }.toList()
        if (categoryEntries.isEmpty() && subCategories.isEmpty()) {
            return Optional.empty()
        }
        val actualSpendings = getEntryTotals({ obj: BudgetEntry -> obj.actualAmount }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::actualAmount, subCategories))
        val expectedSpendings = getEntryTotals({ obj: BudgetEntry -> obj.expectedAmount }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, subCategories))
        val allowedSpendings = getEntryTotals({ obj: BudgetEntry -> obj.allowedSpendings }, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, subCategories))
        val percent = BudgetService.getSpendingPercent(actualSpendings, expectedSpendings)
        return Optional.of(BudgetEntryTreeEntry(category.id, category.name, actualSpendings, expectedSpendings, allowedSpendings, percent, categoryEntries, subCategories))
    }

    @PostMapping(value = ["/budgets"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody budget: Budget?): Budget {
        return budgetService!!.create(budget)
    }

    @GetMapping(value = ["/budgets"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(@RequestParam("limit") limit: Optional<Int?>, @RequestParam("cursor") cursor: Optional<String?>): Budgets {
        val budgetCursor = cursor.flatMap { o: String? -> cursorHelper!!.cursorFromString(o, BudgetCursor::class.java) }.orElse(BudgetCursor(limit.orElse(null), null))
        val budgets = budgetService!!.list(budgetCursor.limit, budgetCursor.pointer)
        val self = cursorHelper!!.cursorToString(budgetCursor).orElse("")
        var first: String? = ""
        var next: String? = ""
        if (limit.isPresent || cursor.isPresent) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            val firstCursor = BudgetCursor(budgetCursor.limit, 0L)
            first = cursorHelper.cursorToString(firstCursor).orElse("")
            next = if (budgets.items.isEmpty() || budgets.left == 0L) {
                "" //We may have no items at all or no items left, so no need to find next cursor
            } else {
                val nextCursor = BudgetCursor(budgetCursor.limit, budgets.items[budgets.items.size - 1].id)
                cursorHelper.cursorToString(nextCursor).orElse("")
            }
        }
        return Budgets(budgets.items, self, first, next, budgets.left)
    }

    @GetMapping(value = ["/budgets/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long?): Budget {
        return budgetService!![id].orElseThrow { MdgException("BUDGET_NOT_FOUND") }
    }

    @PutMapping(value = ["/budgets/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long?, @RequestBody budget: Budget?): Budget {
        return budgetService!!.update(id, budget).orElseThrow { MdgException("BUDGET_NOT_FOUND") }
    }

    @DeleteMapping("/budgets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long?) {
        budgetService!!.delete(id)
    }

    @GetMapping(value = ["/budgets/{budgetId}/entries"], produces = ["application/vnd.mdg+json;version=1"])
    fun listEntries(@PathVariable("budgetId") budgetId: Long?, @RequestParam("embed") embed: Collection<String>?): BudgetEntries {
        return BudgetEntries(budgetService!!.listEntries(budgetId).stream().map(Embedding.embedBudgetEntryObject(embed)).toList())
    }

    @GetMapping(value = ["/budgets/{budgetId}/entries/tree"], produces = ["application/vnd.mdg+json;version=1"])
    fun tree(@PathVariable("budgetId") budgetId: Long?, @RequestParam("embed") embed: Collection<String>?, @RequestParam("filter") filter: Optional<String?>): BudgetEntryTree {
        budgetService!![budgetId].orElseThrow { MdgException("BUDGET_NOT_FOUND") }
        val categories = categoryService!!.list()
        var entries = budgetService.listEntries(budgetId)
        val leaveEmtpy = filter.map { anotherString: String? -> "all".equals(anotherString, ignoreCase = true) }.orElse(false)
        if (!leaveEmtpy) {
            entries = entries.stream().filter { e: BudgetEntry -> !(e.actualAmount.compareTo(BigDecimal.ZERO) == 0 && e.expectedAmount.compareTo(BigDecimal.ZERO) == 0) }.toList()
        }
        val expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, entries, embed)
        val incomeEntry = convertTopCategory(AccountType.INCOME, categories, entries, embed)
        return BudgetEntryTree(expenseEntry, incomeEntry)
    }

    @GetMapping(value = ["/budgets/{budgetId}/entries/{entryId}"], produces = ["application/vnd.mdg+json;version=1"])
    fun getEntry(@PathVariable("budgetId") budgetId: Long?, @PathVariable("entryId") entryId: Long?, @RequestParam("embed") embed: Collection<String>?): BudgetEntry {
        return budgetService!!.getBudgetEntry(entryId).map(Embedding.embedBudgetEntryObject(embed)).orElseThrow { MdgException("BUDGETENTRY_NOT_FOUND") }
    }

    @PutMapping(value = ["/budgets/{budgetId}/entries/{entryId}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateEntry(@PathVariable("budgetId") budgetId: Long?, @PathVariable("entryId") entryId: Long?, @RequestBody entry: BudgetEntry?): BudgetEntry {
        return budgetService!!.updateBudgetEntry(entryId, entry).map(Embedding.embedBudgetEntryObject(null)).orElseThrow { MdgException("BUDGETENTRY_NOT_FOUND") }
    }

    companion object {
        protected fun getCategoryTotals(f: Function<BudgetEntryTreeEntry, BigDecimal>?, entries: Collection<BudgetEntryTreeEntry>): BigDecimal {
            return entries.stream().map(f).reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        }
    }
}