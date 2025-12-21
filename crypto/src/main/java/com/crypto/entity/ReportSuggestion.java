package com.crypto.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "report_suggestions")
public class ReportSuggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "crypto_type")
    private String cryptoType;
    
    @Column(name = "current_percentage")
    private Double currentPercentage;
    
    @Column(name = "suggested_percentage")
    private Double suggestedPercentage;
    
    private String reason;
    
    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;
}
