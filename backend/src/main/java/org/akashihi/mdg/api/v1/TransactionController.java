package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping(value = "/transactions", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Transaction create(@RequestBody Transaction tx) {
        return transactionService.create(tx);
    }
}
