package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE ACCOUNT SET CATEGORY_ID=null WHERE category_id = ?1")
    void dropCategory(Long id);

    @Query(nativeQuery = true, value = "SELECT balance FROM account_balance WHERE account_id = ?1")
    Optional<BigDecimal> getBalance(Long id);
}
