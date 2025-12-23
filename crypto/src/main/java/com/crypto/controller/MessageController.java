package com.crypto.controller;

import com.crypto.entity.Message;
import com.crypto.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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

    // 新增：保存单条消息（用于Dify测试）
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveMessage(@RequestBody Message message) {
        try {
            Message savedMessage = messageService.saveMessage(message);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "消息保存成功",
                    "data", savedMessage
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "消息保存失败: " + e.getMessage()
            ));
        }
    }

    // 新增：批量保存消息（用于Dify测试）
    @PostMapping("/batch-save")
    public ResponseEntity<Map<String, Object>> saveMessages(@RequestBody List<Message> messages) {
        try {
            List<Message> savedMessages = messageService.saveMessages(messages);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "消息批量保存成功",
                    "data", savedMessages,
                    "count", savedMessages.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "消息批量保存失败: " + e.getMessage()
            ));
        }
    }
}