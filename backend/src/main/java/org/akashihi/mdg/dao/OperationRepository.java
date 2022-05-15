package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OperationRepository extends JpaRepository<Operation, Long> {
    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM operation where tx_id = ?1")
    void deleteOperationsForTransaction(Long tx_id);
}
