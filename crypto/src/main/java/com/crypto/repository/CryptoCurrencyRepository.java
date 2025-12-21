package com.crypto.repository;

import com.crypto.entity.CryptoCurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CryptoCurrencyRepository extends JpaRepository<CryptoCurrency, Long> {
    // 根据货币符号查询
    Optional<CryptoCurrency> findBySymbol(String symbol);
}