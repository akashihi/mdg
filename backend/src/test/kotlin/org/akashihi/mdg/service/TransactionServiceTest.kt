package org.akashihi.mdg.service

import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.OperationRepository
import org.akashihi.mdg.dao.TagRepository
import org.akashihi.mdg.dao.TransactionRepository
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.entity.Operation
import org.akashihi.mdg.entity.Rate
import org.akashihi.mdg.entity.Tag
import org.akashihi.mdg.entity.Transaction
import org.akashihi.mdg.indexing.IndexingService
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDateTime

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension::class)
internal class TransactionServiceTest(@Mock private val accountRepository: AccountRepository,
                                      @Mock private val transactionRepository: TransactionRepository,
                                      @Mock private val tagRepository: TagRepository,
                                      @Mock private val operationRepository: OperationRepository,
                                      @Mock private val indexingService: IndexingService,
                                      @Mock private val rateService: RateService) {

    private val transactionService: TransactionService = TransactionService(accountRepository, transactionRepository, tagRepository, operationRepository, indexingService, rateService)

    private fun makeAccount(currencyId: Long): Account {
        val currency = Currency(code="", name="", active = true, id = currencyId)
        return Account(accountType = AccountType.ASSET, balance = BigDecimal.ZERO, primaryBalance = BigDecimal.ZERO, name = "TEST", currency = currency)
    }

    private fun makeOperation(currencyId: Long, rate: String, amount: String, tx: Transaction): Operation {
        val account = makeAccount(currencyId)
        return Operation(rate = BigDecimal(rate), amount = BigDecimal(amount), account = account, transaction = tx)
    }

    @Test
    fun replaceCurrencyKeepingDefault() {
        val tx = Transaction(ts = LocalDateTime.now(), tags = mutableSetOf(), operations = mutableListOf())
        val usdOp = makeOperation(840L, "0.84", "-119", tx)
        val eurOp = makeOperation(978L, "1", "200", tx)
        val czkOp1 = makeOperation(203L, "0.04", "-1250", tx)
        val czkOp2 = makeOperation(203L, "0.04", "-1250", tx)
        val ops = mutableListOf(usdOp, eurOp, czkOp1, czkOp2)
        tx.operations = ops
        val newTx = transactionService.replaceCurrency(tx, czkOp1.account!!, eurOp.account!!.currency!!)
        val replaced = newTx.operations.stream().filter { o: Operation -> o.account == czkOp1.account }.findFirst().get()
        Assertions.assertEquals(BigDecimal.ONE, replaced.rate)
        Assertions.assertEquals(BigDecimal("-50.04"), replaced.amount)
        val eurSum = newTx.operations.stream().map { o: Operation -> o.amount.multiply(o.rate) }.reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        Assertions.assertEquals(BigDecimal.ZERO, eurSum.stripTrailingZeros())
    }

    @Test
    fun replaceCurrencySkippingDefault() {
        val tx = Transaction(ts = LocalDateTime.now(), tags = mutableSetOf(), operations = mutableListOf())
        val usdOp = makeOperation(840L, "0.84", "-119", tx)
        val eurOp = makeOperation(978L, "1", "200", tx)
        val czkOp1 = makeOperation(203L, "0.04", "-1250", tx)
        val czkOp2 = makeOperation(203L, "0.04", "-1250", tx)
        val ops = mutableListOf(usdOp, eurOp, czkOp1, czkOp2)
        tx.operations = ops
        Mockito.`when`(
            rateService.getPair(any(), eq(eurOp.account!!.currency!!), eq(usdOp.account!!.currency!!))
        ).thenReturn(Rate(LocalDateTime.MIN, LocalDateTime.MAX, eurOp.account!!.currency!!.id!!, usdOp.account!!.currency!!.id!!, BigDecimal("0.84"), 1L))
        val newTx = transactionService.replaceCurrency(tx, czkOp1.account!!, usdOp.account!!.currency!!)
        val replaced = newTx.operations.stream().filter { o: Operation -> o.account == czkOp1.account }.findFirst().get()
        Assertions.assertEquals(BigDecimal("0.84"), replaced.rate)
        Assertions.assertEquals(BigDecimal("-59.57"), replaced.amount)
        val eurSum = newTx.operations.stream().map { o: Operation -> o.amount.multiply(o.rate) }.reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        Assertions.assertEquals(BigDecimal.ZERO, eurSum.setScale(2, RoundingMode.DOWN).stripTrailingZeros())
    }

    @Test
    fun replaceDefault() {
        val tx = Transaction(ts = LocalDateTime.now(), tags = mutableSetOf(), operations = mutableListOf())
        val usdOp = makeOperation(840L, "0.84", "-119", tx)
        val eurOp = makeOperation(978L, "1", "200", tx)
        val czkOp1 = makeOperation(203L, "0.04", "-1250", tx)
        val czkOp2 = makeOperation(203L, "0.04", "-1250", tx)
        val ops = mutableListOf(usdOp, eurOp, czkOp1, czkOp2)
        tx.operations = ops
        Mockito.`when`(
            rateService.getPair(any(), eq(usdOp.account!!.currency!!), eq(czkOp1.account!!.currency!!))
        ).thenReturn(Rate(LocalDateTime.MIN, LocalDateTime.MAX, usdOp.account!!.currency!!.id!!, usdOp.account!!.currency!!.id!!, BigDecimal("21.00"), 1L))
        val newTx = transactionService.replaceCurrency(tx, eurOp.account!!, czkOp1.account!!.currency!!)
        val replaced = newTx.operations.stream().filter { o: Operation -> o.account == eurOp.account }.findFirst().get()
        Assertions.assertEquals(BigDecimal.ONE, replaced.rate)
        Assertions.assertEquals(BigDecimal("4999"), replaced.amount.stripTrailingZeros())
        val eurSum = newTx.operations.stream().map { o: Operation -> o.amount.multiply(o.rate) }.reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        Assertions.assertEquals(BigDecimal.ZERO, eurSum.setScale(2, RoundingMode.DOWN).stripTrailingZeros())
    }
}
