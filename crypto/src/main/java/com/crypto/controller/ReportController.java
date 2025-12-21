package com.crypto.controller;

import com.crypto.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> reports = reportService.getReports(status, page, size);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getReportById(@PathVariable Long id) {
        Map<String, Object> report = reportService.getReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        String status = request.get("status");
        if (status == null || !status.matches("^(pending|approved|rejected)$")) {
            return ResponseEntity.badRequest().build();
        }
        
        reportService.updateReportStatus(id, status);
        
        Map<String, Object> response = Map.of(
                "success", true,
                "message", "报告状态已更新"
        );
        
        return ResponseEntity.ok(response);
    }
}
