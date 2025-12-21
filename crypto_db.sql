/*
 Navicat Premium Data Transfer

 Source Server         : Mysql
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : crypto_db

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 20/12/2025 18:47:12
*/

-- 设置字符集和外键检查
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ======================================
-- 加密货币价格数据表
-- 存储 Dify 爬取的加密货币价格信息
-- ======================================
DROP TABLE IF EXISTS `crypto_currency`;
CREATE TABLE `crypto_currency`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '加密货币名称（如：比特币）',
  `symbol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '加密货币符号（如：BTC）',
  `update_time` datetime(6) NOT NULL COMMENT '数据更新时间',
  `usd_price` decimal(16, 8) NOT NULL COMMENT '美元价格（支持8位小数）',
  `cny_price` decimal(16, 8) NULL DEFAULT NULL COMMENT '人民币价格（兼容Dify输出）',
  `change_24h` decimal(10, 4) NULL DEFAULT NULL COMMENT '24小时涨跌幅（兼容Dify输出）',
  `volume_24h` decimal(20, 2) NULL DEFAULT NULL COMMENT '24小时成交量（兼容Dify输出）',
  `market_cap` decimal(25, 2) NULL DEFAULT NULL COMMENT '市值（兼容Dify输出）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UK7ja34xjnw9b7hpmnvt9ghr14i`(`symbol`) USING BTREE COMMENT '保证加密货币符号唯一性'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of crypto_currency
-- ----------------------------

-- ======================================
-- 市场消息表
-- 存储加密货币相关的市场消息和新闻
-- ======================================
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '消息内容',
  `created_at` datetime(6) NULL DEFAULT NULL COMMENT '消息创建时间',
  `crypto_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '相关加密货币类型',
  `is_read` bit(1) NULL DEFAULT NULL COMMENT '是否已读（0：未读，1：已读）',
  `sentiment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '情感分析结果（如：正面、负面、中性）',
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '消息来源',
  `source_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '消息源URL',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ======================================
-- 投资组合历史表
-- 存储投资组合的历史数据记录
-- ======================================
DROP TABLE IF EXISTS `portfolio_history`;
CREATE TABLE `portfolio_history`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `crypto_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '加密货币类型',
  `date` date NULL DEFAULT NULL COMMENT '记录日期',
  `percentage` double NULL DEFAULT NULL COMMENT '占投资组合百分比',
  `total_value` double NULL DEFAULT NULL COMMENT '总价值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of portfolio_history
-- ----------------------------

-- ======================================
-- 投资组合项目表
-- 存储当前投资组合的具体项目
-- ======================================
DROP TABLE IF EXISTS `portfolio_items`;
CREATE TABLE `portfolio_items`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `crypto_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '加密货币类型',
  `percentage` double NULL DEFAULT NULL COMMENT '占投资组合百分比',
  `price` double NULL DEFAULT NULL COMMENT '当前价格',
  `quantity` double NULL DEFAULT NULL COMMENT '持有数量',
  `value` double NULL DEFAULT NULL COMMENT '持有价值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of portfolio_items
-- 初始持仓数据：总额1000万美元
-- ----------------------------
INSERT INTO `portfolio_items` VALUES (1, 'BTC', 40.0, 40000.0, 100.0, 4000000.0);
INSERT INTO `portfolio_items` VALUES (2, 'ETH', 35.0, 2000.0, 1750.0, 3500000.0);
INSERT INTO `portfolio_items` VALUES (3, 'SOL', 15.0, 100.0, 15000.0, 1500000.0);
INSERT INTO `portfolio_items` VALUES (4, 'USDT', 10.0, 1.0, 1000000.0, 1000000.0);

-- ======================================
-- 报告建议表
-- 存储AI生成的投资建议详情
-- ======================================
DROP TABLE IF EXISTS `report_suggestions`;
CREATE TABLE `report_suggestions`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `crypto_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '加密货币类型',
  `current_percentage` double NULL DEFAULT NULL COMMENT '当前投资组合占比',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '建议理由',
  `suggested_percentage` double NULL DEFAULT NULL COMMENT '建议投资组合占比',
  `report_id` bigint(20) NULL DEFAULT NULL COMMENT '所属报告ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK6nue8gl5h26yjoa9nxefftt2`(`report_id`) USING BTREE COMMENT '关联报告表的外键索引',
  CONSTRAINT `FK6nue8gl5h26yjoa9nxefftt2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT COMMENT '关联到报告表'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of report_suggestions
-- ----------------------------

-- ======================================
-- 报告表
-- 存储AI生成的投资报告
-- ======================================
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `created_at` datetime(6) NULL DEFAULT NULL COMMENT '报告生成时间',
  `message_count` int(11) NULL DEFAULT NULL COMMENT '分析的消息数量',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '报告状态（如：待审核、已发布）',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '报告标题',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reports
-- ----------------------------

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;
