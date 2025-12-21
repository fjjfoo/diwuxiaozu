package com.crypto.repository;

import com.crypto.entity.PortfolioHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PortfolioHistoryRepository extends JpaRepository<PortfolioHistory, Long> {
    @Query("SELECT ph FROM PortfolioHistory ph WHERE ph.date >= :startDate ORDER BY ph.date ASC")
    List<PortfolioHistory> findByDateGreaterThanEqualOrderByDateAsc(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT ph FROM PortfolioHistory ph WHERE ph.date = :date ORDER BY ph.cryptoType ASC")
    List<PortfolioHistory> findByDateOrderByCryptoTypeAsc(@Param("date") LocalDate date);
}
