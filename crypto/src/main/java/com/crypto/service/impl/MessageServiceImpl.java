package com.crypto.service.impl;

import com.crypto.entity.Message;
import com.crypto.repository.MessageRepository;
import com.crypto.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageServiceImpl implements MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Override
    public Map<String, Object> getMessages(String cryptoType, String sentiment, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        List<Message> messages;
        
        // 根据参数组合查询条件
        if (cryptoType != null && sentiment != null && startDate != null && endDate != null) {
            messages = messageRepository.findByCryptoTypeAndSentimentAndCreatedAtBetween(cryptoType, sentiment, startDate, endDate);
        } else if (cryptoType != null && startDate != null && endDate != null) {
            messages = messageRepository.findByCryptoTypeAndCreatedAtBetween(cryptoType, startDate, endDate);
        } else if (sentiment != null && startDate != null && endDate != null) {
            messages = messageRepository.findBySentimentAndCreatedAtBetween(sentiment, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            messages = messageRepository.findByCreatedAtBetween(startDate, endDate);
        } else {
            messages = messageRepository.findAll();
        }
        
        // 分页处理
        int total = messages.size();
        int pages = (int) Math.ceil((double) total / size);
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, total);
        List<Message> pageMessages = messages.subList(fromIndex, toIndex);
        
        // 构造响应
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("pages", pages);
        result.put("current", page);
        result.put("records", pageMessages);
        
        return result;
    }
    
    @Override
    public Message getMessageById(Long id) {
        return messageRepository.findById(id).orElse(null);
    }
    
    @Override
    public void markMessageAsRead(Long id) {
        Message message = messageRepository.findById(id).orElse(null);
        if (message != null) {
            message.setRead(true);
            messageRepository.save(message);
        }
    }
}
