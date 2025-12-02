package com.crypto.service;

import com.crypto.entity.CryptoCurrency;
import java.util.List;

public interface CryptoCurrencyService {
    // 批量保存/更新
    void batchSaveOrUpdate(List<CryptoCurrency> cryptoList);

    // 查询所有数据
    List<CryptoCurrency> findAll();
}