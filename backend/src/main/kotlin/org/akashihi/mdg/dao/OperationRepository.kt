package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Operation
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface OperationRepository : JpaRepository<Operation, Long> {
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM operation where tx_id = ?1")
    fun deleteOperationsForTransaction(txId: Long)

    @Query(nativeQuery = true, value = "SELECT DISTINCT TRUE FROM operation WHERE account_id=?1")
    fun doOperationsExistForAccount(accountId: Long): Boolean?
}
