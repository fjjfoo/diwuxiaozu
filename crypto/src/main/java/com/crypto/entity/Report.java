package com.crypto.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "message_count")
    private Integer messageCount;
    
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<ReportSuggestion> suggestions;
}
