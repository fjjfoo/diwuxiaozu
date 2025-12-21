package com.crypto.service.impl;

import com.crypto.entity.PortfolioHistory;
import com.crypto.entity.PortfolioItem;
import com.crypto.repository.PortfolioHistoryRepository;
import com.crypto.repository.PortfolioItemRepository;
import com.crypto.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PortfolioServiceImpl implements PortfolioService {
    
    @Autowired
    private PortfolioItemRepository portfolioItemRepository;
    
    @Autowired
    private PortfolioHistoryRepository portfolioHistoryRepository;
    
    @Override
    public Map<String, Object> getCurrentPortfolio() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取所有持仓项目
        List<PortfolioItem> items = portfolioItemRepository.findAll();
        
        // 计算总价值
        double totalValue = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        
        // 计算每个项目的价值和占比
        List<Map<String, Object>> portfolioItems = items.stream().map(item -> {
            Map<String, Object> portfolioItem = new HashMap<>();
            double value = item.getQuantity() * item.getPrice();
            double percentage = (value / totalValue) * 100;
            
            portfolioItem.put("id", item.getId());
            portfolioItem.put("cryptoType", item.getCryptoType());
            portfolioItem.put("quantity", item.getQuantity());
            portfolioItem.put("price", item.getPrice());
            portfolioItem.put("value", value);
            portfolioItem.put("percentage", percentage);
            
            return portfolioItem;
        }).collect(Collectors.toList());
        
        result.put("totalValue", totalValue);
        result.put("items", portfolioItems);
        
        return result;
    }
    
    @Override
    public List<Map<String, Object>> getPortfolioHistory(int days) {
        // 计算起始日期
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        
        // 获取指定日期范围内的历史数据
        List<PortfolioHistory> historyList = portfolioHistoryRepository.findByDateGreaterThanEqualOrderByDateAsc(startDate);
        
        // 按照日期分组
        Map<LocalDate, List<PortfolioHistory>> historyByDate = historyList.stream()
                .collect(Collectors.groupingBy(PortfolioHistory::getDate));
        
        // 构造响应数据
        List<Map<String, Object>> result = new ArrayList<>();
        
        historyByDate.forEach((date, items) -> {
            Map<String, Object> historyItem = new HashMap<>();
            historyItem.put("date", date.toString());
            historyItem.put("totalValue", items.get(0).getTotalValue());
            
            List<Map<String, Object>> cryptoItems = items.stream().map(item -> {
                Map<String, Object> cryptoItem = new HashMap<>();
                cryptoItem.put("cryptoType", item.getCryptoType());
                cryptoItem.put("percentage", item.getPercentage());
                return cryptoItem;
            }).collect(Collectors.toList());
            
            historyItem.put("items", cryptoItems);
            result.add(historyItem);
        });
        
        // 按日期排序
        result.sort(Comparator.comparing(item -> item.get("date").toString()));
        
        return result;
    }
    
    @Override
    public Map<String, Object> updatePortfolio(List<PortfolioItem> items) {
        // 删除现有的所有持仓项目
        portfolioItemRepository.deleteAll();
        
        // 计算总价值
        double totalValue = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        
        // 保存新的持仓项目
        List<PortfolioItem> savedItems = items.stream().map(item -> {
            double value = item.getQuantity() * item.getPrice();
            double percentage = (value / totalValue) * 100;
            
            item.setValue(value);
            item.setPercentage(percentage);
            
            return portfolioItemRepository.save(item);
        }).collect(Collectors.toList());
        
        // 保存到持仓历史表
        LocalDate today = LocalDate.now();
        savedItems.forEach(item -> {
            PortfolioHistory history = new PortfolioHistory();
            history.setDate(today);
            history.setTotalValue(totalValue);
            history.setCryptoType(item.getCryptoType());
            history.setPercentage(item.getPercentage());
            
            portfolioHistoryRepository.save(history);
        });
        
        // 构造响应数据
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "持仓数据已更新");
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalValue", totalValue);
        data.put("items", savedItems);
        
        result.put("data", data);
        
        return result;
    }
    
    @Override
    public Map<String, Object> getHoldingsForAI() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取所有持仓项目
        List<PortfolioItem> items = portfolioItemRepository.findAll();
        
        // 计算总价值
        double totalValue = items.stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        
        // 构造AI友好的持仓信息格式
        List<Map<String, Object>> holdings = items.stream().map(item -> {
            Map<String, Object> holding = new HashMap<>();
            double value = item.getQuantity() * item.getPrice();
            double percentage = (value / totalValue) * 100;
            
            holding.put("asset", item.getCryptoType());
            holding.put("quantity", item.getQuantity());
            holding.put("price", item.getPrice());
            holding.put("value", value);
            holding.put("percentage", percentage);
            
            return holding;
        }).collect(Collectors.toList());
        
        result.put("totalValueUSD", totalValue);
        result.put("holdings", holdings);
        result.put("timestamp", new Date());
        
        return result;
    }
}
