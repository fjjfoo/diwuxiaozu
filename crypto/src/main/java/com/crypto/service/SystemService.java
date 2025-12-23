package com.crypto.service;

import java.util.Map;

public interface SystemService {
    Map<String, Object> getSystemOverview();
    Map<String, Object> saveSystemSettings(Map<String, Object> settings);
}