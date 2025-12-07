package com.crypto.controller;

import com.crypto.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
