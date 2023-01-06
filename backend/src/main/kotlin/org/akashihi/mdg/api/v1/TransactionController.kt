package org.akashihi.mdg.api.v1

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.ObjectMapper
import org.akashihi.mdg.api.util.CursorHelper
import org.akashihi.mdg.api.util.FilterConverter.buildFilter
import org.akashihi.mdg.api.v1.filtering.Embedding.embedOperationObjects
import org.akashihi.mdg.entity.Operation
import org.akashihi.mdg.entity.Transaction
import org.akashihi.mdg.service.TransactionService
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

data class TransactionCursor(
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val filter: Map<String, String>?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val sort: Collection<String>?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val embed: Collection<String>?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val limit: Int?,
    @field:JsonInclude(JsonInclude.Include.NON_NULL) val pointer: Long?
)

data class Transactions(val transactions: Collection<Transaction>, val self: String, val first: String, val next: String, val left: Long)

@RestController
open class TransactionController(private val objectMapper: ObjectMapper, private val transactionService: TransactionService, private val cursorHelper: CursorHelper) {
    private fun buildCursor(query: String?, sort: Collection<String>?, embed: Collection<String>?, limit: Int?, pointer: Long?): TransactionCursor {
        val filter = buildFilter(query, objectMapper)
        return TransactionCursor(filter, sort, embed, limit, pointer)
    }

    @PostMapping(value = ["/transactions"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody tx: Transaction): Transaction {
        val newTransaction = transactionService.create(tx)
        newTransaction.operations.forEach { it.account = null } //No embedding on creation
        return newTransaction
    }

    @GetMapping(value = ["/transactions"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(
        @RequestParam("q") query: String?,
        @RequestParam("sort") sort: Collection<String>?,
        @RequestParam("embed") embed: Collection<String>?,
        @RequestParam("limit") limit: Int?,
        @RequestParam("cursor") cursor: String?
    ): Transactions {
        val txCursor = cursor?.let { cursorHelper.cursorFromString(it, TransactionCursor::class.java) } ?: buildCursor(query, sort, embed, limit, null)
        val listResult = transactionService.list(txCursor.filter ?: Collections.emptyMap(), txCursor.sort ?: Collections.emptyList(), txCursor.limit, txCursor.pointer)
        val transactions = listResult.items
        val left = listResult.left
        val operationEmbedded = embedOperationObjects(txCursor.embed)
        transactions.forEach { it.operations = it.operations.map{o: Operation ->
                o.account!!.balance = BigDecimal.ZERO
                o.account!!.primaryBalance = BigDecimal.ZERO
                operationEmbedded(o)
            }.toMutableList()
        }
        val self = cursorHelper.cursorToString(txCursor) ?: ""
        var first: String = ""
        var next: String = ""
        if (limit != null || cursor !=null) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            val firstCursor = TransactionCursor(txCursor.filter, txCursor.sort, txCursor.embed, txCursor.limit, 0L)
            first = cursorHelper.cursorToString(firstCursor) ?: ""
            next = if (transactions.isEmpty() || left == 0L) {
                "" //We may have no items at all or no items left, so no need to find next cursor
            } else {
                val nextCursor = TransactionCursor(txCursor.filter, txCursor.sort, txCursor.embed, txCursor.limit, transactions[transactions.size - 1].id)
                cursorHelper.cursorToString(nextCursor) ?: ""
            }
        }
        return Transactions(transactions, self, first, next, left)
    }

    @GetMapping(value = ["/transactions/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long, @RequestParam("embed") embed: Collection<String>?): Transaction {
        val tx = transactionService[id] ?: throw MdgException("TRANSACTION_NOT_FOUND")
        val operationEmbedded = embedOperationObjects(embed)
        tx.operations = tx.operations.map { operationEmbedded(it) }.toMutableList()
        return tx
    }

    @PutMapping(value = ["/transactions/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long, @RequestBody tx: Transaction): Transaction {
        val newTx = transactionService.update(id, tx) ?: throw MdgException("TRANSACTION_NOT_FOUND")
        val operationEmbedded = embedOperationObjects(null)
        newTx.operations = newTx.operations.map{operationEmbedded(it)}.toMutableList()
        return newTx
    }

    @DeleteMapping("/transactions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long) = transactionService.delete(id)
}