package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Transaction
import org.springframework.data.jpa.domain.Specification
import java.util.stream.Stream

interface TransactionRepositoryCustom {
    fun streamByAccount(spec: Specification<Transaction>): Stream<Transaction>
}