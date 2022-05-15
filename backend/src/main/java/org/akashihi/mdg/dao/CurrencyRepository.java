package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {
    Collection<Currency> findAllByActiveTrueOrderByNameAsc();
}
