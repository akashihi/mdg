package org.akashihi.mdg.service;

import org.akashihi.mdg.dao.AccountRepository;
import org.akashihi.mdg.dao.OperationRepository;
import org.akashihi.mdg.dao.TagRepository;
import org.akashihi.mdg.dao.TransactionRepository;
import org.akashihi.mdg.entity.*;
import org.akashihi.mdg.indexing.IndexingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private TagRepository tagRepository;
    @Mock
    private OperationRepository operationRepository;
    @Mock
    private IndexingService indexingService;
    @Mock
    private RateService rateService;

    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        transactionService = new TransactionService(accountRepository, transactionRepository, tagRepository, operationRepository, indexingService, rateService);
    }

    private Account makeAccount(Long currencyId){
        var currency = new Currency("", "", true, currencyId);
        var account = new Account();
        account.setCurrency(currency);
        return account;
    }

    private Operation makeOperation(Long currencyId, String rate, String amount) {
        var account = makeAccount(currencyId);
        var op = new Operation();
        op.setRate(new BigDecimal(rate));
        op.setAmount(new BigDecimal(amount));
        op.setAccount(account);
        return op;
    }

    @Test
    void replaceCurrencyKeepingDefault() {
        var usdOp = makeOperation(840L, "0.84", "-119");
        var eurOp = makeOperation(978L, "1", "200");
        var czkOp1 = makeOperation(203L, "0.04", "-1250");
        var czkOp2 = makeOperation(203L, "0.04", "-1250");
        List<Operation> ops = new ArrayList<>(List.of(usdOp, eurOp, czkOp1, czkOp2));

        var tx = new Transaction();
        tx.setOperations(ops);

        var newTx = transactionService.replaceCurrency(tx, czkOp1.getAccount(), eurOp.getAccount().getCurrency());

        var replaced = newTx.getOperations().stream().filter(o -> o.getAccount().equals(czkOp1.getAccount())).findFirst().get();
        assertEquals(BigDecimal.ONE, replaced.getRate());
        assertEquals(new BigDecimal("-50.04"), replaced.getAmount());
        var eurSum = newTx.getOperations().stream().map(o-> o.getAmount().multiply(o.getRate())).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(BigDecimal.ZERO, eurSum.stripTrailingZeros());
    }

    @Test
    void replaceCurrencySkippingDefault() {
        var usdOp = makeOperation(840L, "0.84", "-119");
        var eurOp = makeOperation(978L, "1", "200");
        var czkOp1 = makeOperation(203L, "0.04", "-1250");
        var czkOp2 = makeOperation(203L, "0.04", "-1250");
        List<Operation> ops = new ArrayList<>(List.of(usdOp, eurOp, czkOp1, czkOp2));

        var tx = new Transaction();
        tx.setOperations(ops);

        when(rateService.getPair(any(), eq(eurOp.getAccount().getCurrency()), eq(usdOp.getAccount().getCurrency()))).thenReturn(new Rate(LocalDateTime.MIN, LocalDateTime.MAX, eurOp.getAccount().getCurrency().getId(), usdOp.getAccount().getCurrency().getId(), new BigDecimal("0.84"), 1L));
        var newTx = transactionService.replaceCurrency(tx, czkOp1.getAccount(), usdOp.getAccount().getCurrency());

        var replaced = newTx.getOperations().stream().filter(o -> o.getAccount().equals(czkOp1.getAccount())).findFirst().get();
        assertEquals(new BigDecimal("0.84"), replaced.getRate());
        assertEquals(new BigDecimal("-59.57"), replaced.getAmount());
        var eurSum = newTx.getOperations().stream().map(o-> o.getAmount().multiply(o.getRate())).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(BigDecimal.ZERO, eurSum.setScale(2, RoundingMode.DOWN).stripTrailingZeros());
    }

    @Test
    void replaceDefault() {
        var usdOp = makeOperation(840L, "0.84", "-119");
        var eurOp = makeOperation(978L, "1", "200");
        var czkOp1 = makeOperation(203L, "0.04", "-1250");
        var czkOp2 = makeOperation(203L, "0.04", "-1250");
        List<Operation> ops = new ArrayList<>(List.of(usdOp, eurOp, czkOp1, czkOp2));

        var tx = new Transaction();
        tx.setOperations(ops);

        when(rateService.getPair(any(), eq(usdOp.getAccount().getCurrency()), eq(czkOp1.getAccount().getCurrency()))).thenReturn(new Rate(LocalDateTime.MIN, LocalDateTime.MAX, usdOp.getAccount().getCurrency().getId(), usdOp.getAccount().getCurrency().getId(), new BigDecimal("21.00"), 1L));
        var newTx = transactionService.replaceCurrency(tx, eurOp.getAccount(), czkOp1.getAccount().getCurrency());

        var replaced = newTx.getOperations().stream().filter(o -> o.getAccount().equals(eurOp.getAccount())).findFirst().get();

        assertEquals(BigDecimal.ONE, replaced.getRate());
        assertEquals(new BigDecimal("4999"), replaced.getAmount().stripTrailingZeros());
        var eurSum = newTx.getOperations().stream().map(o-> o.getAmount().multiply(o.getRate())).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(BigDecimal.ZERO, eurSum.setScale(2, RoundingMode.DOWN).stripTrailingZeros());
    }
}