import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, message, Descriptions, Statistic, Row, Col, Tag, Space } from 'antd';
import { DollarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getCryptoList } from '../api/crypto';
import type { CryptoCurrency } from '../types/crypto';

const { Title, Text } = Typography;

const CryptoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cryptoData, setCryptoData] = useState<CryptoCurrency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取加密货币详情数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCryptoList();
        // 从列表中找到匹配ID的数据
        const crypto = response.data.find(item => item.id.toString() === id);
        if (crypto) {
          setCryptoData(crypto);
        } else {
          message.error('未找到该加密货币');
        }
      } catch (error) {
        console.error('获取加密货币详情失败:', error);
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Text type="secondary">未找到加密货币数据</Text>
      </div>
    );
  }

  // 计算涨跌幅样式
  const getChangeRateStyle = () => {
    const changeRate = parseFloat(cryptoData.change24h || '0');
    return changeRate > 0 ? { color: '#52c41a' } : { color: '#f5222d' };
  };

  // 获取涨跌幅图标
  const getChangeRateIcon = () => {
    const changeRate = parseFloat(cryptoData.change24h || '0');
    return changeRate > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>{cryptoData.name} ({cryptoData.symbol})</Title>
        <Text type="secondary">加密货币详细信息</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="基本信息">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="名称">{cryptoData.name}</Descriptions.Item>
              <Descriptions.Item label="代码">{cryptoData.symbol}</Descriptions.Item>
              <Descriptions.Item label="当前价格(USD)">
                <Statistic 
                  value={parseFloat(cryptoData.usdPrice)} 
                  prefix={<DollarOutlined />} 
                  formatter={(value) => `$${typeof value === 'number' ? value.toFixed(8) : value}`}
                />
              </Descriptions.Item>
              <Descriptions.Item label="当前价格(CNY)">
                <Statistic 
                  value={parseFloat(cryptoData.cnyPrice || '0')} 
                  prefix="¥" 
                  formatter={(value) => `¥${typeof value === 'number' ? value.toFixed(8) : value}`}
                />
              </Descriptions.Item>
              <Descriptions.Item label="涨跌幅">
                <Statistic 
                  value={parseFloat(cryptoData.change24h || '0')} 
                  suffix="%" 
                  valueStyle={getChangeRateStyle()}
                  prefix={getChangeRateIcon()}
                />
              </Descriptions.Item>
              <Descriptions.Item label="市值">
                <Statistic 
                  value={parseFloat(cryptoData.marketCap || '0')} 
                  prefix={<DollarOutlined />} 
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </Descriptions.Item>
              <Descriptions.Item label="24小时成交量">
                <Statistic 
                  value={parseFloat(cryptoData.volume24h || '0')} 
                  prefix={<DollarOutlined />} 
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">{new Date(cryptoData.updateTime).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="市场状态">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>24小时交易</Text>
                <div style={{ marginTop: 8 }}>
                  <Statistic 
                    value={parseFloat(cryptoData.volume24h || '0')} 
                    prefix={<DollarOutlined />} 
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </div>
              </div>
              
              <div>
                <Text strong style={{ fontSize: 16 }}>状态</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color="green">活跃</Tag>
                </div>
              </div>
              
              <div>
                <Text strong style={{ fontSize: 16 }}>数据来源</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">AI驱动数字货币投资辅助系统</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CryptoDetail;