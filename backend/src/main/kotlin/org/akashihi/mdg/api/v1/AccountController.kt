package org.akashihi.mdg.api.v1

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.ObjectMapper
import org.akashihi.mdg.api.util.FilterConverter
import org.akashihi.mdg.api.v1.filtering.Embedding
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.service.AccountService
import org.akashihi.mdg.service.CategoryService
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
import java.util.*

data class CategoryTreeEntry(
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val id: Long?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val name: String?,
    val accounts: Collection<Account>,
    val categories: Collection<CategoryTreeEntry>
)

data class CategoryTree(val asset: CategoryTreeEntry, val expense: CategoryTreeEntry, val income: CategoryTreeEntry)

data class Accounts(val accounts: Collection<Account>)

data class AccountStatus(val id: Long, val deletable: Boolean)

@RestController
class AccountController(private val accountService: AccountService, private val categoryService: CategoryService, private val objectMapper: ObjectMapper) {
    private fun convertTopCategory(accountType: AccountType, categories: Collection<Category>, accounts: Collection<Account>): CategoryTreeEntry {
        val topAccounts = accounts.filter { it.accountType == accountType }.filter { it.categoryId == null }
        val topCategories = ArrayList<CategoryTreeEntry>()
        val favoriteAccounts = accounts.filter { it.accountType == accountType }.filter { it.favorite == true }
        if (favoriteAccounts.isNotEmpty()) {
            val favoriteCategory = CategoryTreeEntry(-1L, "Favorite", favoriteAccounts, emptyList())
            topCategories.add(0, favoriteCategory)
        }
        if (accountType != AccountType.ASSET) {
            val popularAccounts = accountService.listPopularByType(accountType)
            if (popularAccounts.isNotEmpty()) {
                val popularCategory = CategoryTreeEntry(-1*popularAccounts.hashCode().toLong(), "Popular", popularAccounts, emptyList())
                topCategories.add(0, popularCategory)
            }
        }
        topCategories.addAll(categories.filter { a: Category -> a.accountType == accountType }.mapNotNull { c: Category -> convertCategory(c, accounts) })
        return CategoryTreeEntry(null, null, topAccounts, topCategories)
    }

    private fun convertCategory(category: Category, accounts: Collection<Account>): CategoryTreeEntry? {
        val categoryAccounts = accounts.filter { a: Account -> a.categoryId != null }.filter { a: Account -> a.categoryId == category.id }
        val subCategories = category.children.mapNotNull { convertCategory(it, accounts) }
        return if (categoryAccounts.isEmpty() && subCategories.isEmpty()) {
            null
        } else {
            CategoryTreeEntry(category.id, category.name, categoryAccounts, subCategories)
        }
    }

    @PostMapping(value = ["/accounts"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody account: Account): Account {
        val newAccount = accountService.create(account)
        newAccount.category = null // Do not embed on creation
        newAccount.currency = null
        return newAccount
    }

    @GetMapping(value = ["/accounts"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(@RequestParam("q") query: String?, @RequestParam("embed") embed: Collection<String>?): Accounts =
        Accounts(accountService.list(FilterConverter.buildFilter(query, objectMapper)).map { Embedding.embedAccountObjects(embed).invoke(it) })

    @GetMapping(value = ["/accounts/tree"], produces = ["application/vnd.mdg+json;version=1"])
    fun tree(@RequestParam("q") query: String?, @RequestParam("embed") embed: Collection<String>?): CategoryTree {
        val categories = categoryService.list()
        val accounts = accountService.list(FilterConverter.buildFilter(query, objectMapper)).stream().map(Embedding.embedAccountObjects(embed)).toList()
        val assetEntry = convertTopCategory(AccountType.ASSET, categories, accounts)
        val expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, accounts)
        val incomeEntry = convertTopCategory(AccountType.INCOME, categories, accounts)
        return CategoryTree(assetEntry, expenseEntry, incomeEntry)
    }

    @GetMapping(value = ["/accounts/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long, @RequestParam("embed") embed: Collection<String>?): Account = accountService[id]?.let { Embedding.embedAccountObjects(embed).invoke(it) } ?: throw MdgException("ACCOUNT_NOT_FOUND")

    @PutMapping(value = ["/accounts/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long, @RequestBody account: Account): Account {
        val newAccount = accountService.update(id, account) ?: throw MdgException("ACCOUNT_NOT_FOUND")
        newAccount.currencyId = newAccount.currency!!.id
        newAccount.categoryId = newAccount.category?.id
        return newAccount
    }

    @DeleteMapping("/accounts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long) = accountService.delete(id)

    @GetMapping(value = ["/accounts/{id}/status"], produces = ["application/vnd.mdg+json;version=1"])
    fun getStatus(@PathVariable("id") id: Long): AccountStatus = AccountStatus(id, accountService.isDeletable(id))
}
