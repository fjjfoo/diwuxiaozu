package com.crypto.entity;

import com.fasterxml.jackson.annotation.JsonProperty; // 导入注解
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "crypto_currency")
public class CryptoCurrency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String symbol;

    @Column(nullable = false, length = 50)
    private String name;

    // 兼容 Dify 输出的 "usd_price" 或 "price" 键名
    @Column(nullable = false, precision = 16, scale = 8)
    @JsonProperty(value = "usd_price") // 对应 Dify 输出的 usd_price
    // 若 Dify 输出的是 price，则改为 @JsonProperty(value = "price")
    private BigDecimal usdPrice;

    // 人民币价格 - 兼容 Dify 输出
    @Column(precision = 16, scale = 8)
    @JsonProperty(value = "cny_price")
    private BigDecimal cnyPrice;

    // 24小时涨跌幅 - 兼容 Dify 输出
    @Column(precision = 10, scale = 4)
    @JsonProperty(value = "change_24h")
    private BigDecimal change24h;

    // 24小时成交量 - 兼容 Dify 输出
    @Column(precision = 20, scale = 2)
    @JsonProperty(value = "volume_24h")
    private BigDecimal volume24h;

    // 市值 - 兼容 Dify 输出
    @Column(precision = 25, scale = 2)
    @JsonProperty(value = "market_cap")
    private BigDecimal marketCap;

    @Column(nullable = false)
    private LocalDateTime updateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getUsdPrice() {
        return usdPrice;
    }

    public void setUsdPrice(BigDecimal usdPrice) {
        this.usdPrice = usdPrice;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }
}