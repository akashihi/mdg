package org.akashihi.mdg.api.v1

import com.fasterxml.jackson.databind.ObjectMapper
import lombok.RequiredArgsConstructor
import org.akashihi.mdg.api.util.CursorHelper
import org.akashihi.mdg.api.util.FilterConverter.buildFilter
import org.akashihi.mdg.api.v1.dto.TransactionCursor
import org.akashihi.mdg.api.v1.dto.Transactions
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
import java.util.function.Consumer

@RestController
open class TransactionController(private val objectMapper: ObjectMapper, private val transactionService: TransactionService, private val cursorHelper: CursorHelper) {
    private fun buildCursor(query: String?, sort: Optional<Collection<String?>?>, embed: Optional<Collection<String?>?>, limit: Optional<Int?>, pointer: Optional<Long>): TransactionCursor {
        val filter = buildFilter(query, objectMapper!!)
        return TransactionCursor(filter, sort.orElse(emptyList<String>()), embed.orElse(emptyList<String>()), limit.orElse(null), pointer.orElse(null))
    }

    @PostMapping(value = ["/transactions"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody tx: Transaction?): Transaction {
        val newTransaction = transactionService!!.create(tx)
        newTransaction.operations.forEach(Consumer { o: Operation -> o.account = null }) //No embedding on creation
        return newTransaction
    }

    @GetMapping(value = ["/transactions"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(
        @RequestParam("q") query: String?,
        @RequestParam("sort") sort: Optional<Collection<String?>?>,
        @RequestParam("embed") embed: Optional<Collection<String?>?>,
        @RequestParam("limit") limit: Optional<Int?>,
        @RequestParam("cursor") cursor: Optional<String?>
    ): Transactions {
        val txCursor = cursor.flatMap { o: String? -> cursorHelper!!.cursorFromString(o, TransactionCursor::class.java) }.orElse(buildCursor(query, sort, embed, limit, Optional.empty()))
        val listResult = transactionService!!.list(txCursor.filter, txCursor.sort, txCursor.limit, txCursor.pointer)
        val transactions = listResult.items
        val left = listResult.left
        val operationEmbedded = embedOperationObjects(txCursor.embed)
        transactions.forEach(Consumer { tx: Transaction ->
            tx.operations = tx.operations.stream().peek { o: Operation ->
                o.account!!.balance = BigDecimal.ZERO
                o.account!!.primaryBalance = BigDecimal.ZERO
            }.map(operationEmbedded).toList()
        })
        val self = cursorHelper!!.cursorToString(txCursor).orElse("")
        var first: String? = ""
        var next: String? = ""
        if (limit.isPresent || cursor.isPresent) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            val firstCursor = TransactionCursor(txCursor.filter, txCursor.sort, txCursor.embed, txCursor.limit, 0L)
            first = cursorHelper.cursorToString(firstCursor).orElse("")
            next = if (transactions.isEmpty() || left == 0L) {
                "" //We may have no items at all or no items left, so no need to find next cursor
            } else {
                val nextCursor = TransactionCursor(txCursor.filter, txCursor.sort, txCursor.embed, txCursor.limit, transactions[transactions.size - 1].id)
                cursorHelper.cursorToString(nextCursor).orElse("")
            }
        }
        return Transactions(transactions, self, first, next, left)
    }

    @GetMapping(value = ["/transactions/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long?, @RequestParam("embed") embed: Collection<String>?): Transaction {
        val tx = transactionService!![id].orElseThrow { MdgException("TRANSACTION_NOT_FOUND") }
        val operationEmbedded = embedOperationObjects(embed)
        tx.operations = tx.operations.stream().map(operationEmbedded).toList()
        return tx
    }

    @PutMapping(value = ["/transactions/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long?, @RequestBody tx: Transaction?): Transaction {
        val newTx = transactionService!!.update(id, tx).orElseThrow { MdgException("TRANSACTION_NOT_FOUND") }
        val operationEmbedded = embedOperationObjects(null)
        newTx.operations = newTx.operations.stream().map(operationEmbedded).toList()
        return newTx
    }

    @DeleteMapping("/transactions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long?) {
        transactionService!!.delete(id)
    }
}