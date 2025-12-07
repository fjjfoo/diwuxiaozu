package com.crypto.scheduler;

import com.crypto.entity.PortfolioHistory;
import com.crypto.entity.PortfolioItem;
import com.crypto.repository.PortfolioHistoryRepository;
import com.crypto.repository.PortfolioItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ScheduledTasks {
    
    @Autowired
    private PortfolioItemRepository portfolioItemRepository;
    
    @Autowired
    private PortfolioHistoryRepository portfolioHistoryRepository;
    
    // 每日凌晨2点备份持仓数据
    @Scheduled(cron = "0 0 2 * * ?")
    public void backupPortfolioData() {
        // 获取当前持仓数据
        List<PortfolioItem> items = portfolioItemRepository.findAll();
        
        // 计算总价值
        double totalValue = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        
        // 保存到持仓历史表
        LocalDate today = LocalDate.now();
        items.forEach(item -> {
            PortfolioHistory history = new PortfolioHistory();
            history.setDate(today);
            history.setTotalValue(totalValue);
            history.setCryptoType(item.getCryptoType());
            history.setPercentage((item.getQuantity() * item.getPrice() / totalValue) * 100);
            
            portfolioHistoryRepository.save(history);
        });
        
        System.out.println("持仓数据备份完成：" + today);
    }
    
    // 每日凌晨3点采集市场消息
    @Scheduled(cron = "0 0 3 * * ?")
    public void collectMarketMessages() {
        // TODO: 实现市场消息采集逻辑
        // 这里可以调用第三方API获取市场消息并保存到数据库
        
        System.out.println("市场消息采集任务执行：" + LocalDate.now());
    }
}
