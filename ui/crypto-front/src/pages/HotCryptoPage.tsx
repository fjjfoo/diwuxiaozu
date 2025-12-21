import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Space, Button, Tag, Tooltip, message } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, SafetyCertificateOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getHotCryptoList } from '../api/hotCrypto';
import type { HotCrypto } from '../types/hotCrypto';

const { Title, Text } = Typography;

// 格式化大数字
const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

// 格式化价格
const formatPrice = (price: number): string => {
  if (price < 0.0001) {
    return `$${price.toFixed(8)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 100) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// 格式化交易次数
const formatTrades = (num: number): string => {
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
};

const HotCryptoPage: React.FC = () => {
  const [cryptoList, setCryptoList] = useState<HotCrypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getHotCryptoList({ page, pageSize });
      setCryptoList(response.data.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
      message.success('数据加载成功');
    } catch (error) {
      console.error('获取热门货币数据失败:', error);
      setCryptoList([]);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (paginationConfig: { current?: number; pageSize?: number }) => {
    fetchData(paginationConfig.current, paginationConfig.pageSize);
  };

  // 渲染涨跌幅
  const renderChange = (value: number) => {
    const isUp = value > 0;
    const isZero = value === 0;
    return (
      <span style={{
        color: isZero ? '#666' : (isUp ? '#52c41a' : '#ff4d4f'),
        fontWeight: 500
      }}>
        {isUp ? '+' : ''}{value.toFixed(2)}%
        {!isZero && (isUp ? <ArrowUpOutlined style={{ marginLeft: 4 }} /> : <ArrowDownOutlined style={{ marginLeft: 4 }} />)}
      </span>
    );
  };

  // 渲染安全状态
  const renderSecurityStatus = (score: number, status: 'safe' | 'warning' | 'danger') => {
    const config = {
      safe: { color: 'success', icon: <SafetyCertificateOutlined />, text: '安全' },
      warning: { color: 'warning', icon: <WarningOutlined />, text: '警告' },
      danger: { color: 'error', icon: <CloseCircleOutlined />, text: '危险' },
    };
    const { color, icon, text } = config[status];
    return (
      <Tooltip title={`安全评分: ${score}/100`}>
        <Tag color={color} icon={icon}>
          {text} {score}
        </Tag>
      </Tooltip>
    );
  };

  const columns = [
    {
      title: '#',
      key: 'rank',
      render: (_: unknown, __: HotCrypto, index: number) => (
        <Text strong>{(pagination.current - 1) * pagination.pageSize + index + 1}</Text>
      ),
      width: 60,
      align: 'center' as const,
    },
    {
      title: '名称',
      key: 'name',
      render: (_: unknown, record: HotCrypto) => (
        <Space>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#1677FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: 12
          }}>
            {record.symbol.substring(0, 3)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.symbol}</div>
          </div>
        </Space>
      ),
      width: 160,
      fixed: 'left' as const,
    },
    {
      title: '价格',
      key: 'price',
      render: (_: unknown, record: HotCrypto) => (
        <Text strong style={{ fontSize: '14px' }}>{formatPrice(record.price)}</Text>
      ),
      width: 130,
      sorter: (a: HotCrypto, b: HotCrypto) => a.price - b.price,
    },
    {
      title: '1小时%',
      key: 'change1h',
      render: (_: unknown, record: HotCrypto) => renderChange(record.change1h),
      width: 110,
      sorter: (a: HotCrypto, b: HotCrypto) => a.change1h - b.change1h,
    },
    {
      title: '24小时%',
      key: 'change24h',
      render: (_: unknown, record: HotCrypto) => renderChange(record.change24h),
      width: 110,
      sorter: (a: HotCrypto, b: HotCrypto) => a.change24h - b.change24h,
    },
    {
      title: '市值',
      key: 'marketCap',
      render: (_: unknown, record: HotCrypto) => (
        <Text>{formatNumber(record.marketCap)}</Text>
      ),
      width: 120,
      sorter: (a: HotCrypto, b: HotCrypto) => a.marketCap - b.marketCap,
    },
    {
      title: '交易量(24h)',
      key: 'volume24h',
      render: (_: unknown, record: HotCrypto) => (
        <Text>{formatNumber(record.volume24h)}</Text>
      ),
      width: 120,
      sorter: (a: HotCrypto, b: HotCrypto) => a.volume24h - b.volume24h,
    },
    {
      title: 'DEX流动性',
      key: 'dexLiquidity',
      render: (_: unknown, record: HotCrypto) => (
        <Text>{formatNumber(record.dexLiquidity)}</Text>
      ),
      width: 120,
      sorter: (a: HotCrypto, b: HotCrypto) => a.dexLiquidity - b.dexLiquidity,
    },
    {
      title: '年龄',
      key: 'age',
      render: (_: unknown, record: HotCrypto) => (
        <Tag color="blue">{record.age}</Tag>
      ),
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'DEX交易(24h)',
      key: 'dexTrades24h',
      render: (_: unknown, record: HotCrypto) => (
        <Text>{formatTrades(record.dexTrades24h)}</Text>
      ),
      width: 120,
      sorter: (a: HotCrypto, b: HotCrypto) => a.dexTrades24h - b.dexTrades24h,
    },
    {
      title: '安全扫描',
      key: 'securityScore',
      render: (_: unknown, record: HotCrypto) => renderSecurityStatus(record.securityScore, record.securityStatus),
      width: 110,
      align: 'center' as const,
      sorter: (a: HotCrypto, b: HotCrypto) => a.securityScore - b.securityScore,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>热门货币</Title>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => fetchData(pagination.current, pagination.pageSize)}
            loading={loading}
          >
            刷新数据
          </Button>
        </div>

        <Card bordered={false}>
          <Table
            dataSource={cryptoList}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1400 }}
            bordered
            size="middle"
          />
        </Card>
      </Space>
    </div>
  );
};

export default HotCryptoPage;
