package com.crypto.repository;

import com.crypto.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCryptoTypeAndSentimentAndCreatedAtBetween(
            @Param("cryptoType") String cryptoType,
            @Param("sentiment") String sentiment,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    List<Message> findByCryptoTypeAndCreatedAtBetween(
            @Param("cryptoType") String cryptoType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    List<Message> findBySentimentAndCreatedAtBetween(
            @Param("sentiment") String sentiment,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    List<Message> findByCreatedAtBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.isRead = false")
    Long countUnreadMessages();
}
