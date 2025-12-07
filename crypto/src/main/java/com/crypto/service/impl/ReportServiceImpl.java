package com.crypto.service.impl;

import com.crypto.entity.Message;
import com.crypto.entity.PortfolioItem;
import com.crypto.entity.Report;
import com.crypto.repository.MessageRepository;
import com.crypto.repository.PortfolioItemRepository;
import com.crypto.repository.ReportRepository;
import com.crypto.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private PortfolioItemRepository portfolioItemRepository;
    
    @Override
    public Map<String, Object> getReports(String status, int page, int size) {
        List<Report> reports;
        
        // 根据状态筛选报告
        if (status != null && !status.isEmpty()) {
            reports = reportRepository.findByStatus(status);
        } else {
            reports = reportRepository.findAll();
        }
        
        // 分页处理
        int total = reports.size();
        int pages = (int) Math.ceil((double) total / size);
        int fromIndex = (page - 1) * size;
        int toIndex = Math.min(fromIndex + size, total);
        List<Report> pageReports = reports.subList(fromIndex, toIndex);
        
        // 构造响应
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("pages", pages);
        result.put("current", page);
        result.put("records", pageReports);
        
        return result;
    }
    
    @Override
    public Map<String, Object> getReportById(Long id) {
        // 获取报告基本信息
        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) {
            return null;
        }
        
        // 构造响应数据
        Map<String, Object> result = new HashMap<>();
        result.put("id", report.getId());
        result.put("title", report.getTitle());
        result.put("status", report.getStatus());
        result.put("createdAt", report.getCreatedAt());
        
        // 获取相关消息
        List<Message> messages = messageRepository.findAll(); // 实际应用中应该有报告和消息的关联
        List<Map<String, Object>> messageList = messages.stream().map(message -> {
            Map<String, Object> msg = new HashMap<>();
            msg.put("id", message.getId());
            msg.put("cryptoType", message.getCryptoType());
            msg.put("content", message.getContent());
            msg.put("sentiment", message.getSentiment());
            return msg;
        }).collect(Collectors.toList());
        result.put("messages", messageList);
        
        // 获取持仓快照
        Map<String, Object> portfolioSnapshot = new HashMap<>();
        List<PortfolioItem> items = portfolioItemRepository.findAll();
        double totalValue = items.stream().mapToDouble(item -> item.getQuantity() * item.getPrice()).sum();
        
        List<Map<String, Object>> portfolioItems = items.stream().map(item -> {
            Map<String, Object> portfolioItem = new HashMap<>();
            double value = item.getQuantity() * item.getPrice();
            double percentage = (value / totalValue) * 100;
            
            portfolioItem.put("cryptoType", item.getCryptoType());
            portfolioItem.put("quantity", item.getQuantity());
            portfolioItem.put("price", item.getPrice());
            portfolioItem.put("value", value);
            portfolioItem.put("percentage", percentage);
            
            return portfolioItem;
        }).collect(Collectors.toList());
        
        portfolioSnapshot.put("totalValue", totalValue);
        portfolioSnapshot.put("items", portfolioItems);
        result.put("portfolioSnapshot", portfolioSnapshot);
        
        // 获取建议
        result.put("suggestions", report.getSuggestions());
        
        return result;
    }
    
    @Override
    public void updateReportStatus(Long id, String status) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report != null) {
            report.setStatus(status);
            reportRepository.save(report);
        }
    }
}
