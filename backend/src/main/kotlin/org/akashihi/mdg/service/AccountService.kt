package org.akashihi.mdg.service

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.AccountSpecification
import org.akashihi.mdg.dao.CategoryRepository
import org.akashihi.mdg.dao.CurrencyRepository
import org.akashihi.mdg.dao.OperationRepository
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Service
open class AccountService(private val accountRepository: AccountRepository, private val budgetService: BudgetService, private val categoryRepository: CategoryRepository, private val currencyRepository: CurrencyRepository, private val transactionService: TransactionService, private val operationRepository: OperationRepository,  @PersistenceContext private val em: EntityManager) {
    @Transactional
    open fun create(account: Account): Account {
        if (account.accountType != AccountType.ASSET) {
            if (account.operational == true) {
                throw MdgException("ACCOUNT_NONASSET_INVALIDFLAG")
            }
            if (account.favorite == true) {
                throw MdgException("ACCOUNT_NONASSET_INVALIDFLAG")
            }
        }
        if (account.accountType == AccountType.ASSET && account.categoryId == null) { // Default category for asset accounts
            val defaultCategory = categoryRepository.findByNameAndAccountType("Current", AccountType.ASSET) ?: throw MdgException("CATEGORY_NOT_FOUND")
            account.category = defaultCategory
            account.categoryId = defaultCategory.id
        }
        val currency = currencyRepository.findByIdOrNull(account.currencyId) ?: throw MdgException("CURRENCY_NOT_FOUND")
        account.currency = currency
        account.categoryId?.also {
            val category = categoryRepository.findByIdOrNull(account.categoryId) ?: throw MdgException("CATEGORY_NOT_FOUND")
            if (category.accountType != account.accountType) {
                throw MdgException("CATEGORY_INVALID_TYPE")
            }
            account.category = category
        }
        account.hidden = false
        accountRepository.save(account)
        log.info("Created account {}", account)
        return account
    }

    @Transactional(readOnly = true)
    open fun list(query: Map<String, String>): Collection<Account> {
        val sort = Sort.by("accountType").ascending().and(Sort.by("name").ascending())
        return if (query.isEmpty()) {
            accountRepository.findAll(sort)
        } else {
            accountRepository.findAll(AccountSpecification.filteredAccount(query), sort)
        }
    }

    @Transactional(readOnly = true)
    open fun listByType(type: AccountType): Collection<Account> = accountRepository.findAllByAccountType(type)

    @Transactional(readOnly = true)
    open fun listPopularByType(type: AccountType): Collection<Account> = accountRepository.getPopularAccountsForType(type.toDbValue()).mapNotNull { this.get(it) }

    @Transactional(readOnly = true)
    open operator fun get(id: Long): Account? = accountRepository.findByIdOrNull(id)

    @Transactional
    open fun update(id: Long, newAccount: Account): Account? {
        val account = accountRepository.findByIdOrNull(id) ?: return null
        if (newAccount.hidden != null) {
            account.hidden = newAccount.hidden
        }
        if (newAccount.name != null) {
            account.name = newAccount.name
        }
        if (newAccount.categoryId == null) {
            account.category = null
        } else {
            val currentCategoryId = account.category?.id
            if (newAccount.categoryId != currentCategoryId) {
                val newCategory = categoryRepository.findByIdOrNull(newAccount.categoryId) ?: throw MdgException("CATEGORY_NOT_FOUND")
                if (newCategory.accountType != account.accountType) {
                    throw MdgException("CATEGORY_INVALID_TYPE")
                }
                account.category = newCategory
            }
        }
        if (account.accountType === AccountType.ASSET) {
            account.favorite = newAccount.favorite
            account.operational = newAccount.operational
            if (account.currency!!.id != newAccount.currencyId) {
                throw MdgException("ACCOUNT_CURRENCY_ASSET")
            }
        } else {
            if (account.currency!!.id != newAccount.currencyId) {
                val currencyValue = currencyRepository.findByIdOrNull(newAccount.currencyId)
                currencyValue?.also { transactionService.updateTransactionsCurrencyForAccount(account, it) }
                currencyValue?.also { budgetService.updateCurrencyForAccount(account, it) }
                currencyValue?.also { account.currency = it }
            }
            if (newAccount.favorite == true || newAccount.operational == true) {
                throw MdgException("ACCOUNT_NONASSET_INVALIDFLAG")
            }
        }
        accountRepository.saveAndFlush(account)
        em.refresh(account)
        return account
    }

    @Transactional
    open fun delete(id: Long) {
        val account = accountRepository.findByIdOrNull(id) ?: throw MdgException("ACCOUNT_NOT_FOUND")
        if (!isDeletable(account.id)) {
            throw MdgException("ACCOUNT_IN_USE")
        }
        accountRepository.delete(account)
    }

    @Transactional(readOnly = true)
    open fun isDeletable(id: Long?): Boolean {
        val account = accountRepository.findByIdOrNull(id) ?: throw MdgException("ACCOUNT_NOT_FOUND")
        return !(operationRepository.doOperationsExistForAccount(account.id!!) ?: false)
    }

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
}
