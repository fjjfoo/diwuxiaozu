import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Space, Row, Col, Button, Statistic, message } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getCryptoList } from '../api/crypto';
import type { CryptoCurrency } from '../types/crypto';

const { Title, Text } = Typography;

const PriceRankings: React.FC = () => {
  // 状态管理
  const [cryptoList, setCryptoList] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取加密货币价格数据
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getCryptoList();
      // 按价格从高到低排序
      const sortedList = response.data.sort((a, b) => {
        return parseFloat(b.usdPrice) - parseFloat(a.usdPrice);
      });
      setCryptoList(sortedList);
      message.success('数据加载成功');
    } catch (error) {
      console.error('获取加密货币价格数据失败:', error);
      // API调用失败时不使用模拟数据，保持为空数组
      setCryptoList([]);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  // 计算统计数据
  const totalMarketCap = cryptoList.reduce((sum, crypto) => {
    return sum + (parseFloat(crypto.marketCap || '0') || 0);
  }, 0);

  const upCount = cryptoList.filter(crypto => {
    const change = parseFloat(crypto.change24h || '0');
    return change > 0;
  }).length;

  const downCount = cryptoList.filter(crypto => {
    const change = parseFloat(crypto.change24h || '0');
    return change < 0;
  }).length;

  // 表格列配置
  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: React.ReactNode, __: CryptoCurrency, index: number) => (
        <Text>{index + 1}</Text>
      ),
      width: 60,
      align: 'center' as 'left' | 'center' | 'right',
    },
    {
      title: '名称',
      key: 'name',
      render: (_: React.ReactNode, record: CryptoCurrency) => (
        <Space>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 8, 
            background: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {record.symbol.substring(0, 2)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.symbol}</div>
          </div>
        </Space>
      ),
      width: 180,
    },
    {
      title: '价格(CNY)',
      key: 'cnyPrice',
      render: (_: React.ReactNode, record: CryptoCurrency) => (
        <Text strong style={{ fontSize: '16px' }}>¥{(parseFloat(record.cnyPrice || '0') || 0).toLocaleString()}</Text>
      ),
      width: 180,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.cnyPrice || '0') - parseFloat(b.cnyPrice || '0');
      },
    },
    {
      title: '24h涨跌',
      key: 'change24h',
      render: (_: React.ReactNode, record: CryptoCurrency) => {
        const change = parseFloat(record.change24h || '0');
        const isUp = change > 0;
        return (
          <Space>
            <span style={{ 
              color: isUp ? '#52c41a' : '#ff4d4f',
              fontWeight: 'bold'
            }}>
              {isUp ? '+' : ''}{change}%
            </span>
            <span style={{ color: isUp ? '#52c41a' : '#ff4d4f' }}>
              {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </span>
          </Space>
        );
      },
      width: 120,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.change24h || '0') - parseFloat(b.change24h || '0');
      },
    },
    {
      title: '24h成交量',
      key: 'volume24h',
      render: (_: React.ReactNode, record: CryptoCurrency) => (
        <Text>¥{(parseFloat(record.volume24h || '0') || 0).toLocaleString()}B</Text>
      ),
      width: 150,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.volume24h || '0') - parseFloat(b.volume24h || '0');
      },
    },
    {
      title: '市值',
      key: 'marketCap',
      render: (_: React.ReactNode, record: CryptoCurrency) => (
        <Text>¥{(parseFloat(record.marketCap || '0') || 0).toLocaleString()}B</Text>
      ),
      width: 150,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.marketCap || '0') - parseFloat(b.marketCap || '0');
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题和刷新按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>数字货币价格排行</Title>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            loading={loading}
          >
            刷新数据
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="总市值"
                value={totalMarketCap}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                suffix="B"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="上涨币种"
                value={upCount}
                prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="下跌币种"
                value={downCount}
                prefix={<ArrowDownOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 价格表格 */}
        <Card loading={loading} bordered={false}>
          <Table
            dataSource={cryptoList}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
            bordered
            size="middle"
          />
        </Card>
      </Space>
    </div>
  );
};

export default PriceRankings;