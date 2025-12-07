package com.crypto.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "portfolio_items")
public class PortfolioItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "crypto_type")
    private String cryptoType;
    
    private Double quantity;
    private Double price;
    private Double value;
    private Double percentage;
}
