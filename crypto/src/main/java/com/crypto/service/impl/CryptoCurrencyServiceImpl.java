package com.crypto.service.impl;

import com.crypto.entity.CryptoCurrency;
import com.crypto.repository.CryptoCurrencyRepository;
import com.crypto.service.CryptoCurrencyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 虚拟货币数据业务层实现（含完整日志、数据校验、事务管理）
 */
@Service
public class CryptoCurrencyServiceImpl implements CryptoCurrencyService {

    // 日志对象（用于打印排查信息）
    private static final Logger log = LoggerFactory.getLogger(CryptoCurrencyServiceImpl.class);

    // 数据访问层依赖
    private final CryptoCurrencyRepository cryptoRepository;

    // 构造器注入（Spring 推荐方式）
    @Autowired
    public CryptoCurrencyServiceImpl(CryptoCurrencyRepository cryptoRepository) {
        this.cryptoRepository = cryptoRepository;
        log.info("CryptoCurrencyServiceImpl 初始化完成");
    }

    /**
     * 批量保存/更新虚拟货币数据
     * 1. 接收前端/Dify 传递的数据列表
     * 2. 数据校验（非空、格式合法）
     * 3. 按 symbol 判断：存在则更新，不存在则新增
     * 4. 事务管理：要么全部成功，要么全部回滚
     */
    @Override
    @Transactional(rollbackFor = Exception.class) // 异常时回滚事务
    public void batchSaveOrUpdate(List<CryptoCurrency> cryptoList) {
        log.info("=== 开始执行批量保存/更新操作 ===");
        log.info("接收的数据总量：{}", cryptoList == null ? 0 : cryptoList.size());

        // 校验数据列表是否为空
        if (cryptoList == null || cryptoList.isEmpty()) {
            log.warn("接收的数据列表为空，无需执行操作");
            return;
        }

        // 遍历处理每条数据
        int successCount = 0; // 成功条数
        int failCount = 0;    // 失败条数
        for (CryptoCurrency crypto : cryptoList) {
            log.info("开始处理数据：{}", crypto);

            try {
                // 1. 数据合法性校验
                if (!validateCryptoData(crypto)) {
                    failCount++;
                    log.error("数据校验失败，跳过该条数据：{}", crypto);
                    continue;
                }

                // 2. 按 symbol 查询是否已存在
                Optional<CryptoCurrency> existingCrypto = cryptoRepository.findBySymbol(crypto.getSymbol());

                if (existingCrypto.isPresent()) {
                    // 3. 已存在：执行更新操作
                    CryptoCurrency updateCrypto = existingCrypto.get();
                    updateCrypto.setName(crypto.getName());
                    updateCrypto.setUsdPrice(crypto.getUsdPrice());
                    updateCrypto.setUpdateTime(crypto.getUpdateTime());
                    cryptoRepository.save(updateCrypto);
                    log.info("更新数据成功：symbol={}, name={}, price={}",
                            updateCrypto.getSymbol(), updateCrypto.getName(), updateCrypto.getUsdPrice());
                    successCount++;
                } else {
                    // 4. 不存在：执行新增操作（清空 id 让数据库自增）
                    crypto.setId(null);
                    cryptoRepository.save(crypto);
                    log.info("新增数据成功：symbol={}, name={}, price={}",
                            crypto.getSymbol(), crypto.getName(), crypto.getUsdPrice());
                    successCount++;
                }
            } catch (Exception e) {
                // 单条数据处理失败，记录日志，继续处理下一条（不影响整体事务）
                failCount++;
                log.error("处理数据失败：symbol={}, 异常信息：{}",
                        crypto.getSymbol(), e.getMessage(), e);
            }
        }

        // 打印操作统计结果
        log.info("=== 批量操作执行完成 ===");
        log.info("总接收条数：{}，成功条数：{}，失败条数：{}",
                cryptoList.size(), successCount, failCount);
    }

    /**
     * 查询所有虚拟货币数据（供前端展示）
     */
    @Override
    public List<CryptoCurrency> findAll() {
        log.info("执行查询所有虚拟货币数据操作");
        List<CryptoCurrency> result = cryptoRepository.findAll();
        log.info("查询结果：共 {} 条数据", result.size());
        return result;
    }

    /**
     * 数据合法性校验（确保字段符合数据库要求）
     * @param crypto 待校验数据
     * @return true：校验通过，false：校验失败
     */
    private boolean validateCryptoData(CryptoCurrency crypto) {
        // 1. 非空校验
        if (crypto == null) {
            log.error("校验失败：数据对象为空");
            return false;
        }
        if (!StringUtils.hasText(crypto.getSymbol())) {
            log.error("校验失败：symbol 字段为空");
            return false;
        }
        if (!StringUtils.hasText(crypto.getName())) {
            log.error("校验失败：name 字段为空（symbol={}）", crypto.getSymbol());
            return false;
        }
        if (crypto.getUsdPrice() == null) {
            log.error("校验失败：usdPrice 字段为空（symbol={}）", crypto.getSymbol());
            return false;
        }
        if (crypto.getUpdateTime() == null) {
            log.error("校验失败：updateTime 字段为空（symbol={}）", crypto.getSymbol());
            return false;
        }

        // 2. 格式/长度校验（匹配数据库字段约束）
        if (crypto.getSymbol().length() > 20) {
            log.error("校验失败：symbol 长度超过 20 字符（symbol={}）", crypto.getSymbol());
            return false;
        }
        if (crypto.getName().length() > 50) {
            log.error("校验失败：name 长度超过 50 字符（symbol={}, name={}）",
                    crypto.getSymbol(), crypto.getName());
            return false;
        }
        // 校验 BigDecimal 精度（最大 16 位整数 + 8 位小数）
        if (crypto.getUsdPrice().precision() > 16) {
            log.error("校验失败：usdPrice 总长度超过 16 位（symbol={}, price={}）",
                    crypto.getSymbol(), crypto.getUsdPrice());
            return false;
        }
        if (crypto.getUsdPrice().scale() > 8) {
            log.error("校验失败：usdPrice 小数位超过 8 位（symbol={}, price={}）",
                    crypto.getSymbol(), crypto.getUsdPrice());
            return false;
        }

        // 所有校验通过
        log.info("数据校验通过：{}", crypto);
        return true;
    }
}