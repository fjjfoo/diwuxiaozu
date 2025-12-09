package com.crypto.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

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
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getMessageCount() {
        return messageCount;
    }
    
    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
    
    public List<ReportSuggestion> getSuggestions() {
        return suggestions;
    }
    
    public void setSuggestions(List<ReportSuggestion> suggestions) {
        this.suggestions = suggestions;
    }
}
