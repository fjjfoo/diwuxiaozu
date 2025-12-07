package com.crypto.service;

import com.crypto.entity.Report;

import java.util.List;
import java.util.Map;

public interface ReportService {
    Map<String, Object> getReports(String status, int page, int size);
    Map<String, Object> getReportById(Long id);
    void updateReportStatus(Long id, String status);
}
