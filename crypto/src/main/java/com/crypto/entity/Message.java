package com.crypto.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "crypto_type")
    private String cryptoType;
    
    private String content;
    private String sentiment;
    private String source;
    
    @Column(name = "source_url")
    private String sourceUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_read")
    private Boolean isRead;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCryptoType() {
        return cryptoType;
    }
    
    public void setCryptoType(String cryptoType) {
        this.cryptoType = cryptoType;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getSentiment() {
        return sentiment;
    }
    
    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getSourceUrl() {
        return sourceUrl;
    }
    
    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    // 为了兼容性，添加 getRead 和 setRead 方法
    public Boolean getRead() {
        return isRead;
    }
    
    public void setRead(Boolean isRead) {
        this.isRead = isRead;
    }
}