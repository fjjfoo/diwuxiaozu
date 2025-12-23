package com.crypto.controller;

import com.crypto.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {
    
    @Autowired
    private SystemService systemService;
    
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getSystemOverview() {
        Map<String, Object> overview = systemService.getSystemOverview();
        return ResponseEntity.ok(overview);
    }
    
    @PostMapping("/settings")
    public ResponseEntity<Map<String, Object>> saveSystemSettings(@RequestBody Map<String, Object> settings) {
        if (settings.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "设置内容不能为空"));
        }
        
        Map<String, Object> result = systemService.saveSystemSettings(settings);
        return ResponseEntity.ok(result);
    }
}