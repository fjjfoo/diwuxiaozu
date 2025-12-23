package com.crypto.service;

import com.crypto.entity.Report;
import com.crypto.entity.ReportSuggestion;

import java.util.List;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getReports(String status, int page, int size);
    Map<String, Object> getReportById(Long id);
    void updateReportStatus(Long id, String status);
    Map<String, Object> createReport(Map<String, Object> reportData);
    
    // ReportSuggestion相关方法
    List<ReportSuggestion> getSuggestionsByReportId(Long reportId);
    ReportSuggestion addSuggestionToReport(Long reportId, Map<String, Object> suggestionData);
    ReportSuggestion updateSuggestion(Long suggestionId, Map<String, Object> suggestionData);
    void deleteSuggestion(Long suggestionId);
}