package com.crypto.service;

import com.crypto.entity.Message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface MessageService {
    Map<String, Object> getMessages(String cryptoType, String sentiment, LocalDateTime startDate, LocalDateTime endDate, int page, int size);
    Message getMessageById(Long id);
    void markMessageAsRead(Long id);
}
