package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationRepository extends JpaRepository<Operation, Long> { }
