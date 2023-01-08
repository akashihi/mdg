package org.akashihi.mdg.service

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.OperationRepository
import org.akashihi.mdg.dao.TagRepository
import org.akashihi.mdg.dao.TransactionRepository
import org.akashihi.mdg.dao.TransactionSpecification
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.entity.Operation
import org.akashihi.mdg.entity.Tag
import org.akashihi.mdg.entity.Transaction
import org.akashihi.mdg.indexing.IndexingService
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDateTime
import java.util.stream.Collectors
import javax.transaction.Transactional

@Service
open class TransactionService(
    private val accountRepository: AccountRepository,
    private val transactionRepository: TransactionRepository,
    private val tagRepository: TagRepository,
    private val operationRepository: OperationRepository,
    private val indexingService: IndexingService,
    private val rateService: RateService
) {
    private fun enrichOperations(tx: Transaction): Transaction {
        // Drop empty operations
        tx.operations = tx.operations.filter { it.amount != BigDecimal.ZERO }.toMutableList()

        // Propagate accounts
        tx.operations.forEach {
            val account = accountRepository.findByIdOrNull(it.account_id) ?: throw MdgException("ACCOUNT_NOT_FOUND")
            it.account = account
        }

        // Set default rate if not specified
        tx.operations.forEach {
            if (it.rate == null) {
                it.rate = BigDecimal.ONE
            }
        }
        return tx
    }

    private fun validateTransaction(tx: Transaction): Transaction {
        // Validate transaction:
        // Check that operation list is not empty
        if (tx.operations.isEmpty()) {
            throw MdgException("TRANSACTION_EMPTY")
        }
        // Check that no operation has rate set to 0
        if (tx.operations.any { BigDecimal.ZERO == it.rate }) {
            throw MdgException("TRANSACTION_ZERO_RATE")
        }
        // Check that at least one operation has default rate (no rate set or rate set to 1)
        if (tx.operations.none { it.rate == BigDecimal.ONE }) {
            throw MdgException("TRANSACTION_NO_DEFAULT_RATE")
        }
        // Check that default rate is only used for one currency, even if it is set on multiple operations
        if (tx.operations.filter { BigDecimal.ONE == it.rate }.map { it.account?.currency }.distinct().count() > 1) {
            throw MdgException("TRANSACTION_AMBIGUOUS_RATE")
        }

        // Check that transaction is balanced. Single currency items should be perfectly balanced
        // For multi currency items relatively small disbalance is allowed
        val multicurrency = tx.operations.any { o: Operation -> o.rate != null }
        val balance = tx.operations.map { it.amount.multiply(it.rate) }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
        if (balance != BigDecimal.ZERO && !multicurrency || !(balance > BigDecimal.ONE.negate() && balance < BigDecimal.ONE)) {
            throw MdgException("TRANSACTION_NOT_BALANCED")
        }
        return tx
    }

    private fun enrichTags(tags: Collection<Tag>): MutableSet<Tag> {
        return tags.map {
            val candidate = tagRepository.findByTag(it.tag)
            if (candidate != null) {
                return@map candidate
            } else {
                tagRepository.save(it)
                return@map it
            }
        }.toMutableSet()
    }

    private fun loadTags(tx: Transaction): Transaction {
        val dbTags = enrichTags(tx.tags)
        tx.tags = dbTags
        return tx
    }

    @Transactional
    open fun create(newTx: Transaction): Transaction {
        var tx = newTx
        tx = enrichOperations(tx)
        tx = validateTransaction(tx)
        tx = loadTags(tx)
        val savedTransaction = transactionRepository.save(tx)
        tx.operations.forEach {
            it.transaction = savedTransaction
            operationRepository.save(it)
        }
        indexingService.storeTransaction(tx)
        tx.id = savedTransaction.id
        return tx
    }

    @Transactional
    open fun list(filter: Map<String, String>, sort: Collection<String>, limit: Int?, pointer: Long?): ListResult<Transaction> {
        val spec = TransactionSpecification.filteredTransactions(indexingService, filter, pointer)
        var sorting = Sort.by("ts").descending().and(Sort.by("id").descending()) // Sort by timestamp amd then id by default
        if (sort.contains("-timestamp")) {
            // Reverse sort requested
            sorting = Sort.by("ts").ascending().and(Sort.by("id").descending())
        }
        if (limit == null) {
            return ListResult(transactionRepository.findAll(spec, sorting), 0L)
        }
        val pageLimit = PageRequest.of(0, limit, sorting)
        val page = transactionRepository.findAll(spec, pageLimit)
        var left = page.totalElements - limit
        if (left < 0) {
            left = 0 // Clamp value in case last page is shorter than limit
        }
        return ListResult(page.content, left)
    }

    @Transactional
    open fun spendingOverPeriod(from: LocalDateTime, to: LocalDateTime, account: Account): BigDecimal {
        val spec = TransactionSpecification.filteredTransactions(from, to, account)
        val transactions = transactionRepository.findAll(spec)
        return transactions.flatMap { it.operations }
            .filter { it.account == account }
            .map(Operation::amount)
            .fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
    }

    @Transactional
    open operator fun get(id: Long): Transaction? = transactionRepository.findByIdOrNull(id)

    @Transactional
    open fun update(id: Long, newTx: Transaction): Transaction? {
        val tx = transactionRepository.findByIdOrNull(id) ?: return null
        tx.ts = newTx.ts
        tx.comment = newTx.comment
        val newTxTagValues = newTx.tags.map { obj: Tag -> obj.tag }.toSet()
        val removedTags = tx.tags.filter { t: Tag -> !newTxTagValues.contains(t.tag) }.toSet()
        tx.tags.removeAll(removedTags)
        val oldTxTagValues = tx.tags.map { obj: Tag -> obj.tag }.toSet()
        val tagsToInsert = newTx.tags.filter { t: Tag -> !oldTxTagValues.contains(t.tag) }.toSet()
        val newTxTags = enrichTags(tagsToInsert)
        tx.tags.addAll(newTxTags)
        var savedTransaction = transactionRepository.save(tx)
        operationRepository.deleteAll(savedTransaction.operations)
        savedTransaction.operations.clear()
        savedTransaction.operations = newTx.operations
        savedTransaction = enrichOperations(savedTransaction)
        val finalTx = validateTransaction(savedTransaction)
        finalTx.operations = finalTx.operations.map {
            it.transaction = finalTx
            operationRepository.save(it)
            it
        }.toMutableList()
        indexingService.storeTransaction(tx)
        return finalTx
    }

    @Transactional
    open fun updateTransactionsCurrencyForAccount(account: Account, newCurrency: Currency) {
        transactionRepository.streamByAccount(TransactionSpecification.transactionsForAccount(account))
            .forEach { tx: Transaction -> replaceCurrency(tx, account, newCurrency) }
    }

    /**
     * Converts one of transaction currencies to another one. The process consists of two major steps: finding new default currency and rebalancing the transaction.
     *
     * Default currency is selected using the following rule: if there is default currency, which is not old or new, use it, otherwise pick new currency as the default on.
     * In the latter case rates of operations on other account could be updated.
     *
     * Rebalancing is more tricky.We drop operations with modified account, find the sum of transaction (which is non-zero) and create a new operation to balance
     * transaction back, with respect to the new currency and rate.
     *
     * @param tx Transaction to update
     * @param account Account to update on the transsaction operations
     * @param newCurrency New currency to use
     * @return Updated transaction.
     */
    @Transactional
    open fun replaceCurrency(tx: Transaction, account: Account, newCurrency: Currency): Transaction {
        val untouchedOps = tx.operations.filter { it.account != account }.toMutableList()
        tx.operations.removeAll(untouchedOps)
        operationRepository.deleteAll(tx.operations)
        val defaultCurrency = untouchedOps
            .filter { o: Operation -> o.rate == null || o.rate == BigDecimal.ONE }
            .map { o: Operation -> o.account!!.currency }.firstOrNull() ?: newCurrency
        val rebalanceEverything = untouchedOps
            .none { o: Operation -> o.rate == null || o.rate == BigDecimal.ONE }
        if (rebalanceEverything) {
            val replaced = untouchedOps.stream().peek { o: Operation ->
                if (o.account!!.currency!! == newCurrency) {
                    o.rate = BigDecimal.ONE
                } else {
                    val rateToNew = rateService.getPair(tx.ts, o.account!!.currency!!, newCurrency)
                    o.rate = rateToNew.rate
                }
            }.collect(Collectors.toList())
            tx.operations = replaced
        } else {
            tx.operations = untouchedOps
        }
        operationRepository.saveAll(tx.operations)
        val replacementOp = Operation(transaction = tx, account = account, rate = BigDecimal.ZERO, amount = BigDecimal.ZERO)
        val txSum = untouchedOps.map { it.amount.multiply(it.rate) }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }.negate()
        if (defaultCurrency.equals(newCurrency)) {
            replacementOp.rate = BigDecimal.ONE
            replacementOp.amount = txSum
        } else {
            val rate = rateService.getPair(tx.ts, defaultCurrency, newCurrency)
            replacementOp.rate = rate.rate
            replacementOp.amount = txSum.divide(rate.rate, RoundingMode.HALF_UP)
        }
        tx.operations.add(replacementOp)
        operationRepository.save(replacementOp)
        return tx
    }

    @Transactional
    open fun delete(id: Long) {
        operationRepository.deleteOperationsForTransaction(id)
        transactionRepository.deleteById(id)
        indexingService.removeTransaction(id)
    }

    @Transactional
    open fun listTags(): Collection<Tag> = tagRepository.findAll(Sort.by("tag").ascending())
}
