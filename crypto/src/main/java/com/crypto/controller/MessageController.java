package com.crypto.controller;

import com.crypto.entity.Message;
import com.crypto.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMessages(
            @RequestParam(required = false) String cryptoType,
            @RequestParam(required = false) String sentiment,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> messages = messageService.getMessages(cryptoType, sentiment, startDate, endDate, page, size);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        Message message = messageService.getMessageById(id);
        if (message == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(message);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markMessageAsRead(@PathVariable Long id) {
        messageService.markMessageAsRead(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "消息已标记为已读");
        
        return ResponseEntity.ok(response);
    }
}
