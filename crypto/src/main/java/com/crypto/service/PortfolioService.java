package com.crypto.service;

import com.crypto.entity.PortfolioItem;

import java.util.List;
import java.util.Map;

public interface PortfolioService {
    Map<String, Object> getCurrentPortfolio();
    List<Map<String, Object>> getPortfolioHistory(int days);
    Map<String, Object> updatePortfolio(List<PortfolioItem> items);
    Map<String, Object> getHoldingsForAI();
}
