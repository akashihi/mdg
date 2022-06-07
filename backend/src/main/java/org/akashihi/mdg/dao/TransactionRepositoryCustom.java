package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.jpa.domain.Specification;

import java.util.stream.Stream;

public interface TransactionRepositoryCustom {
    Stream<Transaction> streamByAccount(Specification<Transaction> spec);
}
