package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> { }
