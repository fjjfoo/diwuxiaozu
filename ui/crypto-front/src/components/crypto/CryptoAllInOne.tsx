import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Alert, Table, Space, Tag } from 'antd';
import { WarningOutlined, DollarOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';
import { getCryptoList } from '../../api/crypto';
import { type CryptoCurrency } from '../../types/crypto';

const { Title, Text } = Typography;

const CryptoAllInOne: React.FC = () => {
  // 状态管理 - 来自 CryptoManager
  const [cryptoList, setCryptoList] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 数据获取逻辑 - 来自 CryptoManager
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCryptoList();
      setCryptoList(res.data);
    } catch (err) {
      setError('数据加载失败，请检查：1.后端服务是否启动 2.数据库连接是否正常 3.接口地址是否正确');
      console.error('加载失败：', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载 + 5分钟定时刷新 - 来自 CryptoManager
  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // 表格列配置 - 来自 CryptoTable
  const columns = [
    {
      title: (
        <Space>
          <TagOutlined />
          <Text>货币符号</Text>
        </Space>
      ),
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      render: (symbol: string) => <Tag color="blue">{symbol}</Tag>,
    },
    {
      title: '货币名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          <Text>美元价格</Text>
        </Space>
      ),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (price: string) => {
        const num = Number(price);
        return `$${num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}`;
      },
    },
    {
      title: (
        <Space>
          <ClockCircleOutlined />
          <Text>更新时间</Text>
        </Space>
      ),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
  ];

  // 渲染 - 来自 CryptoDashboard 和 CryptoTable
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card
        title={
          <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
            虚拟货币价格实时展示（BigDecimal精度版）
          </Title>
        }
        variant="outlined"
        style={{ boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)' }}
      >
        {/* 错误提示 */}
        {error && (
          <Alert
            message="加载失败"
            description={error}
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* 加载状态 + 表格 */}
        <Spin spinning={loading} tip="正在加载数据（若长时间无响应，请检查后端服务）...">
          <Table
            columns={columns}
            dataSource={cryptoList}
            rowKey="symbol"
            pagination={cryptoList.length > 10 ? { pageSize: 10 } : false}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: '暂无数据，请先通过Dify或测试组件推送数据' }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default CryptoAllInOne;