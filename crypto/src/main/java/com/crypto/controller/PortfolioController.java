package com.crypto.controller;

import com.crypto.entity.PortfolioItem;
import com.crypto.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentPortfolio() {
        Map<String, Object> portfolio = portfolioService.getCurrentPortfolio();
        return ResponseEntity.ok(portfolio);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getPortfolioHistory(
            @RequestParam(defaultValue = "7") int days) {
        
        List<Map<String, Object>> history = portfolioService.getPortfolioHistory(days);
        return ResponseEntity.ok(history);
    }
    
    @PutMapping
    public ResponseEntity<Map<String, Object>> updatePortfolio(
            @RequestBody Map<String, List<PortfolioItem>> request) {
        
        List<PortfolioItem> items = request.get("items");
        if (items == null || items.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Map<String, Object> result = portfolioService.updatePortfolio(items);
        return ResponseEntity.ok(result);
    }
    
    /**
     * AI专用持仓查询接口
     * 支持Dify智能体直接调用或后端中转调用
     * 返回简洁明了的持仓资产信息
     */
    @GetMapping("/ai/holdings")
    public ResponseEntity<Map<String, Object>> getHoldingsForAI() {
        Map<String, Object> result = portfolioService.getHoldingsForAI();
        return ResponseEntity.ok(result);
    }
}
