package com.crypto.service.impl;

import com.crypto.repository.MessageRepository;
import com.crypto.repository.PortfolioItemRepository;
import com.crypto.repository.ReportRepository;
import com.crypto.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SystemServiceImpl implements SystemService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private PortfolioItemRepository portfolioItemRepository;
    
    @Override
    public Map<String, Object> getSystemOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        // 获取未读消息数
        Long unreadMessages = messageRepository.countUnreadMessages();
        
        // 获取待审核报告数
        Long pendingReports = reportRepository.countPendingReports();
        
        // 计算总资产估值
        Double totalAssets = portfolioItemRepository.findAll().stream()
                .mapToDouble(item -> item.getValue() != null ? item.getValue() : 0.0)
                .sum();
        
        overview.put("unreadMessages", unreadMessages != null ? unreadMessages : 0);
        overview.put("pendingReports", pendingReports != null ? pendingReports : 0);
        overview.put("totalAssets", totalAssets);
        
        return overview;
    }
}
