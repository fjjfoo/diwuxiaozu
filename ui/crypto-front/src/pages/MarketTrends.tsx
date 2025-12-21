import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Space, Statistic, Tag, Table, Select } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// 市场概览数据类型
interface MarketOverview {
  totalMarketCap: number;
  tradingVolume24h: number;
  btcDominance: number;
  cryptoPerformance: Array<{
    symbol: string;
    price: number;
    change24h: number;
  }>;
}

// 价格历史数据类型
interface PriceHistory {
  symbol: string;
  timestamps: number[];
  prices: number[];
}

// 技术指标类型
interface TechnicalIndicator {
  name: string;
  value: number;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

// 市场情绪数据类型
interface MarketSentiment {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  analysis: string;
  newsCount: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// 新闻摘要类型
interface NewsSummary {
  id: number;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

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
  
  // 模拟数据
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    
    setTimeout(() => {
      // 模拟市场概览数据
      setMarketData({
        totalMarketCap: 1234567890123,
        tradingVolume24h: 456789012345,
        btcDominance: 52.34,
        cryptoPerformance: [
          { symbol: 'BTC', price: 45678.90, change24h: 2.34 },
          { symbol: 'ETH', price: 3456.78, change24h: 1.23 },
          { symbol: 'BNB', price: 456.78, change24h: -0.56 },
          { symbol: 'SOL', price: 123.45, change24h: 5.67 },
        ],
      });
      
      // 模拟价格历史数据
      const now = Date.now();
      const timestamps: number[] = [];
      const prices: number[] = [];
      
      const basePrice = selectedCrypto === 'BTC' ? 45000 : selectedCrypto === 'ETH' ? 3400 : selectedCrypto === 'BNB' ? 450 : 120;
      
      for (let i = 0; i < 100; i++) {
        timestamps.push(now - (100 - i) * 3600000); // 过去100小时
        prices.push(basePrice * (1 + Math.random() * 0.1 - 0.05)); // 随机波动5%
      }
      
      setPriceHistoryData({
        symbol: selectedCrypto,
        timestamps,
        prices,
      });
      
      // 模拟技术指标数据
      setTechnicalData([
        { name: 'RSI', value: 65.23, status: 'bullish', description: '相对强弱指标显示看涨信号' },
        { name: 'MACD', value: 123.45, status: 'bullish', description: '平滑异同移动平均线显示买入信号' },
        { name: 'MA50', value: 44567.89, status: 'neutral', description: '50日均线呈水平状态' },
        { name: 'MA200', value: 42345.67, status: 'bullish', description: '200日均线呈上升趋势' },
        { name: 'Bollinger Bands', value: 2.34, status: 'neutral', description: '布林带宽度正常' },
      ]);
      
      // 模拟市场情绪数据
      setSentimentData({
        overallSentiment: 'positive',
        score: 78.5,
        analysis: '当前市场情绪积极，主要受机构资金流入和技术面突破影响。多数投资者持乐观态度。',
        newsCount: {
          positive: 45,
          negative: 12,
          neutral: 33,
        },
      });
      
      // 模拟新闻摘要数据
      setNewsData([
        { id: 1, title: '比特币突破50000美元关口，创今年新高', source: 'CoinDesk', publishedAt: dayjs().subtract(2, 'hour').toISOString(), sentiment: 'positive', impact: 'high' },
        { id: 2, title: '以太坊2.0升级进展顺利，预计年底完成', source: 'CryptoSlate', publishedAt: dayjs().subtract(5, 'hour').toISOString(), sentiment: 'positive', impact: 'medium' },
        { id: 3, title: 'SEC推迟比特币ETF决议，市场反应平淡', source: 'Bloomberg', publishedAt: dayjs().subtract(8, 'hour').toISOString(), sentiment: 'neutral', impact: 'high' },
        { id: 4, title: '大型机构继续增持比特币，资产管理规模突破100亿美元', source: 'The Block', publishedAt: dayjs().subtract(12, 'hour').toISOString(), sentiment: 'positive', impact: 'medium' },
        { id: 5, title: '监管机构加强对加密货币交易所的监管力度', source: 'Reuters', publishedAt: dayjs().subtract(24, 'hour').toISOString(), sentiment: 'negative', impact: 'medium' },
      ]);
      
      setLoading(false);
    }, 1000);
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
                {marketData?.cryptoPerformance.map((crypto) => (
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
                ))}
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
              <Table
                columns={technicalColumns}
                dataSource={technicalData}
                pagination={false}
                rowKey="name"
              />
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
          <Table
            columns={newsColumns}
            dataSource={newsData}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        </Card>
      </Space>
    </div>
  );
};

export default MarketTrends;