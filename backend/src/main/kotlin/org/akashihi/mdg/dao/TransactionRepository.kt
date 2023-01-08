package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Transaction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.QueryHints
import java.util.stream.Stream
import javax.persistence.QueryHint

interface TransactionRepository : JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction>, TransactionRepositoryCustom {
    @QueryHints(value = [QueryHint(name = org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE, value = "50")])
    fun streamAllBy(): Stream<Transaction>
}
