import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Space, Row, Col, Button, Statistic, message, Input, Select, Empty, type TableProps } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getCryptoList } from '../api/crypto';
import type { CryptoCurrency } from '../types/crypto';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const PriceRankings: React.FC = () => {
  // 状态管理
  const [cryptoList, setCryptoList] = useState<CryptoCurrency[]>([]);
  const [filteredList, setFilteredList] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [sortField, setSortField] = useState<string>('marketCap');
  const [sortOrder, setSortOrder] = useState<string>('descend');

  // 获取加密货币价格数据
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getCryptoList();
      setCryptoList(response.data);
      setFilteredList(response.data);
      message.success('数据加载成功');
    } catch (error) {
      console.error('获取加密货币价格数据失败:', error);
      setCryptoList([]);
      setFilteredList([]);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  // 搜索和筛选功能
  useEffect(() => {
    let result = [...cryptoList];

    // 搜索筛选
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(crypto => 
        crypto.name.toLowerCase().includes(lowerSearchText) ||
        crypto.symbol.toLowerCase().includes(lowerSearchText)
      );
    }

    // 排序
    result = result.sort((a, b) => {
      const aValue = parseFloat(a[sortField as keyof CryptoCurrency] as string || '0');
      const bValue = parseFloat(b[sortField as keyof CryptoCurrency] as string || '0');
      return sortOrder === 'ascend' ? aValue - bValue : bValue - aValue;
    });

    setFilteredList(result);
  }, [cryptoList, searchText, sortField, sortOrder]);

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

  const avgChange = cryptoList.length > 0 
    ? (cryptoList.reduce((sum, crypto) => {
        return sum + (parseFloat(crypto.change24h || '0') || 0);
      }, 0) / cryptoList.length).toFixed(2)
    : '0';

  // 处理排序变化
  const handleTableChange: TableProps<CryptoCurrency>['onChange'] = (_pagination, _filters, sorter) => {
    const sorterInfo = Array.isArray(sorter) ? sorter[0] : sorter;
    if (sorterInfo.field) {
      setSortField(sorterInfo.field as string);
      setSortOrder(sorterInfo.order as string);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: React.ReactNode, __: CryptoCurrency, index: number) => (
        <Text strong style={{ fontSize: '14px' }}>{index + 1}</Text>
      ),
      width: 60,
      align: 'center' as const,
    },
    {
      title: '名称',
      key: 'name',
      render: (_: React.ReactNode, record: CryptoCurrency) => (
        <Link to={`/crypto/${record.id}`} style={{ color: '#1677ff' }}>
          <Space size="middle">
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 999,
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              {record.symbol.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{record.symbol.toUpperCase()}</div>
            </div>
          </Space>
        </Link>
      ),
      width: 180,
    },
    {
      title: '价格(CNY)',
      key: 'cnyPrice',
      dataIndex: 'cnyPrice',
      render: (text: string) => (
        <Text strong style={{ fontSize: '15px' }}>¥{(parseFloat(text || '0') || 0).toLocaleString()}</Text>
      ),
      width: 160,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.cnyPrice || '0') - parseFloat(b.cnyPrice || '0');
      },
    },
    {
      title: '24h涨跌',
      key: 'change24h',
      dataIndex: 'change24h',
      render: (text: string) => {
        const change = parseFloat(text || '0');
        const isUp = change > 0;
        return (
          <Space>
            <span style={{ 
              color: isUp ? '#52c41a' : '#ff4d4f',
              fontWeight: 'bold',
              fontSize: '14px'
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
      dataIndex: 'volume24h',
      render: (text: string) => (
        <Text>¥{(parseFloat(text || '0') || 0).toLocaleString()}B</Text>
      ),
      width: 160,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.volume24h || '0') - parseFloat(b.volume24h || '0');
      },
    },
    {
      title: '市值',
      key: 'marketCap',
      dataIndex: 'marketCap',
      render: (text: string) => (
        <Text strong>¥{(parseFloat(text || '0') || 0).toLocaleString()}B</Text>
      ),
      width: 160,
      sorter: (a: CryptoCurrency, b: CryptoCurrency) => {
        return parseFloat(a.marketCap || '0') - parseFloat(b.marketCap || '0');
      },
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (_: React.ReactNode, record: CryptoCurrency) => {
        if (!record.updateTime) return '-';
        try {
          const date = new Date(record.updateTime);
          return <Text style={{ fontSize: '12px', color: '#999' }}>
            {date.toLocaleString('zh-CN', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </Text>;
        } catch {
          return record.updateTime;
        }
      },
      width: 160,
    },
  ];

  // 自定义排序选项
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_');
    setSortField(field);
    setSortOrder(order as 'ascend' | 'descend');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题和操作区 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <Title level={2} style={{ margin: 0 }}>数字货币价格排行</Title>
          <Space size="middle">
            {/* 排序选择 */}
            <Select
              value={`${sortField}_${sortOrder}`}
              onChange={handleSortChange}
              style={{ width: 200 }}
              size="middle"
            >
              <Option value="marketCap_descend">市值从高到低</Option>
              <Option value="marketCap_ascend">市值从低到高</Option>
              <Option value="cnyPrice_descend">价格从高到低</Option>
              <Option value="cnyPrice_ascend">价格从低到高</Option>
              <Option value="change24h_descend">涨幅从高到低</Option>
              <Option value="change24h_ascend">涨幅从低到高</Option>
              <Option value="volume24h_descend">成交量从高到低</Option>
              <Option value="volume24h_ascend">成交量从低到高</Option>
            </Select>
            
            {/* 搜索框 */}
            <Search
              placeholder="搜索名称或代码"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={value => setSearchText(value)}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 280 }}
            />
            
            {/* 刷新按钮 */}
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={fetchData}
              loading={loading}
              size="middle"
            >
              刷新数据
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable loading={loading} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
              <Statistic
                title="总市值"
                value={totalMarketCap}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#1890ff', fontSize: '22px', fontWeight: 'bold' }}
                suffix="B"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable loading={loading} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
              <Statistic
                title="上涨币种"
                value={upCount}
                prefix={<ArrowUpOutlined style={{ color: '#52c41a', fontSize: '16px' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '22px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable loading={loading} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
              <Statistic
                title="下跌币种"
                value={downCount}
                prefix={<ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />}
                valueStyle={{ color: '#ff4d4f', fontSize: '22px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable loading={loading} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
              <Statistic
                title="平均涨跌幅"
                value={parseFloat(avgChange)}
                valueStyle={{ 
                  color: parseFloat(avgChange) > 0 ? '#52c41a' : '#ff4d4f', 
                  fontSize: '22px', 
                  fontWeight: 'bold' 
                }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* 价格表格 */}
        <Card 
          loading={loading} 
          bordered={false}
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}
        >
          {filteredList.length > 0 ? (
            <Table
              dataSource={filteredList}
              columns={columns}
              rowKey="id"
              pagination={{ 
                pageSize: 15,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '50'],
                showTotal: (total) => `共 ${total} 种加密货币`,
                showQuickJumper: true
              }}
              scroll={{ x: 1000 }}
              onChange={handleTableChange}
              rowClassName="table-row-hover"
              size="middle"
            />
          ) : (
            <Empty
              description={
                <span>没有找到相关数据</span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '60px 0' }}
            >
              <Button type="primary" onClick={fetchData}>
                重新加载
              </Button>
            </Empty>
          )}
        </Card>

        {/* 数据更新提示 */}
        {cryptoList.length > 0 && (
          <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
            <Text>数据最后更新于: {new Date().toLocaleString('zh-CN')}</Text>
          </div>
        )}
      </Space>
    </div>
  );
};

export default PriceRankings;