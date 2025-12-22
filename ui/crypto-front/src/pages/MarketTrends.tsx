import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Space, Statistic, Tag, Table, Select, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { getMarketTrendsData } from '../api/marketTrends';
import type {
  MarketOverview,
  PriceHistory,
  TechnicalIndicator,
  MarketSentiment,
  NewsSummary
} from '../api/marketTrends';

const { Title, Text } = Typography;
const { Option } = Select;

const MarketTrends: React.FC = () => {
  // 状态管理
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistory | null>(null);
  const [technicalData, setTechnicalData] = useState<TechnicalIndicator[]>([]);
  const [sentimentData, setSentimentData] = useState<MarketSentiment | null>(null);
  const [newsData, setNewsData] = useState<NewsSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // 从 Dify API 获取市场趋势数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMarketTrendsData({
          symbol: selectedCrypto,
          timeRange: timeRange,
        });
        
        setMarketData(data.marketOverview);
        setPriceHistoryData(data.priceHistory);
        setTechnicalData(data.technicalIndicators);
        setSentimentData(data.marketSentiment);
        setNewsData(data.newsSummaries);
        
        // 只有当有实际数据时才显示成功消息
        if (Object.values(data).some(item => 
          item && (Array.isArray(item) ? item.length > 0 : Object.keys(item).length > 0)
        )) {
          message.success('市场趋势数据加载成功');
        }
      } catch (error: any) {
        console.error('获取市场趋势数据失败:', error);
        
        // 针对不同错误类型提供更具体的提示
        if (error.message?.includes('timeout')) {
          message.error('数据请求超时，请检查网络连接');
        } else if (error.response?.status === 401) {
          message.error('API授权失败，请检查配置');
        } else if (error.response?.status === 404) {
          message.error('请求的资源不存在');
        } else if (error.response?.status >= 500) {
          message.error('服务器错误，请稍后重试');
        } else {
          message.error('获取市场趋势数据失败，请稍后重试');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCrypto, timeRange]);
  
  // 配置价格走势图
  const chartOption = {
    title: {
      text: `${selectedCrypto} 价格走势`,
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: Array<{ axisValue: number; data: number }>) {
        const date = new Date(params[0].axisValue);
        const price = params[0].data;
        return `${dayjs(date).format('YYYY-MM-DD HH:mm')}<br/>价格: $${price.toLocaleString()}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: function(value: number) {
          return `$${value.toLocaleString()}`;
        },
      },
    },
    series: [
      {
        name: '价格',
        type: 'line',
        data: priceHistoryData?.prices.map((price, index) => [
          priceHistoryData.timestamps[index],
          price,
        ]) || [],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(22, 119, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(22, 119, 255, 0.05)',
              },
            ],
          },
        },
        itemStyle: {
          color: '#1677FF',
        },
        lineStyle: {
          width: 2,
        },
      },
    ],
  };
  
  // 技术指标表格列配置
  const technicalColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => value.toFixed(2),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'bullish' ? 'green' :
          status === 'bearish' ? 'red' : 'gray'
        }>
          {status === 'bullish' ? '看涨' :
           status === 'bearish' ? '看跌' : '中性'}
        </Tag>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <span title={description}>
          {description.length > 50 ? `${description.substring(0, 50)}...` : description}
        </span>
      ),
    },
  ];
  
  // 新闻表格列配置
  const newsColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <a href="#" target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '情绪',
      dataIndex: 'sentiment',
      key: 'sentiment',
      render: (sentiment: string) => (
        <Tag color={
          sentiment === 'positive' ? 'green' :
          sentiment === 'negative' ? 'red' : 'gray'
        }>
          {sentiment === 'positive' ? '正面' :
           sentiment === 'negative' ? '负面' : '中性'}
        </Tag>
      ),
    },
    {
      title: '影响',
      dataIndex: 'impact',
      key: 'impact',
      render: (impact: string) => (
        <Tag color={
          impact === 'high' ? 'red' :
          impact === 'medium' ? 'orange' : 'green'
        }>
          {impact === 'high' ? '高' :
           impact === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
  ];
  
  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题 */}
        <div>
          <Title level={2}>市场趋势分析</Title>
          <Text type="secondary">实时监控数字货币市场趋势和技术指标</Text>
        </div>
        
        {/* 市场概览卡片 */}
        <Card loading={loading}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4} style={{ marginBottom: 16 }}>
                市场概览
              </Title>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="总市值"
                  value={marketData?.totalMarketCap || 0}
                  valueStyle={{ color: '#1890ff' }}
                  formatter={(value) => `$${(Number(value) / 1e12).toFixed(2)}T`}
                />
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="24小时交易量"
                  value={marketData?.tradingVolume24h || 0}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => `$${(Number(value) / 1e9).toFixed(2)}B`}
                />
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title="BTC 占比"
                  value={marketData?.btcDominance || 0}
                  valueStyle={{ color: '#722ed1' }}
                  formatter={(value) => `${Number(value).toFixed(2)}%`}
                />
              </Col>
            </Row>
            
            {/* 主要货币表现 */}
            <div>
              <Title level={5}>主要货币表现</Title>
              <Row gutter={[16, 16]}>
                {marketData?.cryptoPerformance && marketData.cryptoPerformance.length > 0 ? (
                  marketData.cryptoPerformance.map((crypto) => (
                    <Col key={crypto.symbol} xs={24} sm={8} md={6}>
                      <Card size="small" hoverable>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>{crypto.symbol}</Text>
                            <Tag color={crypto.change24h >= 0 ? 'green' : 'red'}>
                              {crypto.change24h >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                              {Math.abs(crypto.change24h).toFixed(2)}%
                            </Tag>
                          </div>
                          <Statistic
                            value={crypto.price}
                            formatter={(value) => `$${value.toLocaleString()}`}
                            valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
                          />
                        </Space>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type="secondary">暂无货币表现数据</Text>
                  </Col>
                )}
              </Row>
            </div>
          </Space>
        </Card>
        
        {/* 趋势图表 */}
        <Card loading={loading}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>价格趋势</Title>
              <Space>
                <Select
                  value={selectedCrypto}
                  onChange={setSelectedCrypto}
                  style={{ width: 120 }}
                >
                  <Option value="BTC">比特币</Option>
                  <Option value="ETH">以太坊</Option>
                  <Option value="BNB">BNB</Option>
                  <Option value="SOL">Solana</Option>
                </Select>
                
                <Select
                  value={timeRange}
                  onChange={setTimeRange}
                  style={{ width: 120 }}
                >
                  <Option value="24h">24小时</Option>
                  <Option value="7d">7天</Option>
                  <Option value="30d">30天</Option>
                  <Option value="90d">90天</Option>
                </Select>
              </Space>
            </div>
            
            <ReactECharts
              option={chartOption}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Space>
        </Card>
        
        {/* 技术指标和市场情绪 */}
        <Row gutter={[16, 16]}>
          {/* 技术指标 */}
          <Col xs={24} md={12}>
            <Card title="技术指标分析" loading={loading}>
              {technicalData.length > 0 ? (
                <Table
                  columns={technicalColumns}
                  dataSource={technicalData}
                  pagination={false}
                  rowKey="name"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">暂无技术指标数据</Text>
                </div>
              )}
            </Card>
          </Col>
          
          {/* 市场情绪 */}
          <Col xs={24} md={12}>
            <Card title="市场情绪分析" loading={loading}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="整体情绪"
                    value={sentimentData?.score || 0}
                    valueStyle={{ color: 
                      sentimentData?.overallSentiment === 'positive' ? '#52c41a' :
                      sentimentData?.overallSentiment === 'negative' ? '#ff4d4f' : '#faad14'
                    }}
                    suffix={
                      <Tag color={
                        sentimentData?.overallSentiment === 'positive' ? 'green' :
                        sentimentData?.overallSentiment === 'negative' ? 'red' : 'orange'
                      }>
                        {sentimentData?.overallSentiment === 'positive' ? '正面' :
                         sentimentData?.overallSentiment === 'negative' ? '负面' : '中性'}
                      </Tag>
                    }
                  />
                </div>
                
                {sentimentData?.analysis && (
                  <div>
                    <Text strong>情绪分析：</Text>
                    <Text type="secondary">{sentimentData.analysis}</Text>
                  </div>
                )}
                
                <div>
                  <Title level={5}>新闻情绪分布</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="正面"
                          value={sentimentData?.newsCount.positive || 0}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="中性"
                          value={sentimentData?.newsCount.neutral || 0}
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={8}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Statistic
                          title="负面"
                          value={sentimentData?.newsCount.negative || 0}
                          valueStyle={{ color: '#ff4d4f' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
        
        {/* 相关新闻 */}
        <Card title="相关新闻摘要" loading={loading}>
          {newsData.length > 0 ? (
            <Table
              columns={newsColumns}
              dataSource={newsData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="secondary">暂无相关新闻数据</Text>
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default MarketTrends;
