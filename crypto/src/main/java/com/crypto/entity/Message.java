package com.crypto.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
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
}