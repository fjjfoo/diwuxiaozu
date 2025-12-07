package com.crypto.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "portfolio_history")
public class PortfolioHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    
    @Column(name = "total_value")
    private Double totalValue;
    
    @Column(name = "crypto_type")
    private String cryptoType;
    
    private Double percentage;
}
