package com.crypto.repository;

import com.crypto.entity.ReportSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportSuggestionRepository extends JpaRepository<ReportSuggestion, Long> {
    // 根据报告ID查询建议列表
    List<ReportSuggestion> findByReportId(Long reportId);
    
    // 根据加密货币类型查询建议列表
    List<ReportSuggestion> findByCryptoType(String cryptoType);
}
