import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Space,
  Button,
  Tag,
  Tabs,
  Row,
  Col,
  Statistic,
  Form,
  InputNumber,
  Select,
  Radio,
  message,
  Modal,
  Divider,
} from 'antd';
import {
  WalletOutlined,
  SwapOutlined,
  OrderedListOutlined,
  HistoryOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import type {
  SimulatedAccount,
  Position,
  Order,
  TradeRecord,
  CryptoQuote,
  TradeDirection,
  OrderType,
} from '../types/trade';
import {
  getSimulatedAccount,
  getPositions,
  getOrders,
  getTradeRecords,
  getCryptoQuotes,
  placeOrder,
  cancelOrder,
  resetAccount,
} from '../api/trade';

const { Title, Text } = Typography;

const SimulatedTrade: React.FC = () => {
  // 状态管理
  const [account, setAccount] = useState<SimulatedAccount | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [quotes, setQuotes] = useState<CryptoQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // 分页状态
  const [positionPageSize, setPositionPageSize] = useState(5);
  const [pendingOrderPageSize, setPendingOrderPageSize] = useState(5);
  const [completedOrderPageSize, setCompletedOrderPageSize] = useState(5);
  const [tradeRecordPageSize, setTradeRecordPageSize] = useState(10);

  // 交易表单
  const [form] = Form.useForm();
  const [tradeDirection, setTradeDirection] = useState<TradeDirection>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [accountData, positionsData, ordersData, recordsData, quotesData] = await Promise.all([
        getSimulatedAccount(),
        getPositions(),
        getOrders(),
        getTradeRecords(),
        getCryptoQuotes(),
      ]);
      setAccount(accountData);
      setPositions(positionsData);
      setOrders(ordersData);
      setTradeRecords(recordsData);
      setQuotes(quotesData);
    } catch {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 获取当前选中币种的行情
  const currentQuote = quotes.find(q => q.symbol === selectedCrypto);

  // 下单处理
  const handlePlaceOrder = async (values: { amount: number; price?: number }) => {
    if (!currentQuote) {
      message.error('请选择交易币种');
      return;
    }

    setOrderLoading(true);
    try {
      await placeOrder({
        cryptoType: selectedCrypto,
        direction: tradeDirection,
        orderType,
        price: orderType === 'limit' ? values.price : currentQuote.price,
        amount: values.amount,
      });
      message.success(`${tradeDirection === 'buy' ? '买入' : '卖出'}订单提交成功`);
      form.resetFields();
      loadData();
    } catch {
      message.error('下单失败，请重试');
    } finally {
      setOrderLoading(false);
    }
  };

  // 取消订单
  const handleCancelOrder = async (orderId: number) => {
    Modal.confirm({
      title: '确认取消',
      icon: <ExclamationCircleOutlined />,
      content: '确定要取消这个订单吗？',
      onOk: async () => {
        try {
          await cancelOrder(orderId);
          message.success('订单已取消');
          loadData();
        } catch {
          message.error('取消订单失败');
        }
      },
    });
  };

  // 重置账户
  const handleResetAccount = () => {
    Modal.confirm({
      title: '重置账户',
      icon: <ExclamationCircleOutlined />,
      content: '确定要重置模拟账户吗？这将清空所有持仓和交易记录，并将余额重置为100,000 USDT。',
      okType: 'danger',
      onOk: async () => {
        try {
          await resetAccount();
          message.success('账户已重置');
          loadData();
        } catch {
          message.error('重置失败');
        }
      },
    });
  };

  // 持仓表格列配置
  const positionColumns: TableProps<Position>['columns'] = [
    {
      title: '币种',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 100,
      sorter: (a, b) => a.cryptoType.localeCompare(b.cryptoType),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '持有数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => amount.toFixed(4),
    },
    {
      title: '平均成本',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      sorter: (a, b) => a.avgPrice - b.avgPrice,
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 120,
      sorter: (a, b) => a.currentPrice - b.currentPrice,
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: '市值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      sorter: (a, b) => a.value - b.value,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: '盈亏',
      dataIndex: 'profitLoss',
      key: 'profitLoss',
      width: 150,
      sorter: (a, b) => a.profitLoss - b.profitLoss,
      render: (pl, record) => (
        <Space>
          <Text type={pl >= 0 ? 'success' : 'danger'}>
            {pl >= 0 ? '+' : ''}{pl.toFixed(2)} USDT
          </Text>
          <Tag color={pl >= 0 ? 'green' : 'red'}>
            {pl >= 0 ? '+' : ''}{record.profitLossRate.toFixed(2)}%
          </Tag>
        </Space>
      ),
    },
  ];

  // 订单表格列配置
  const orderColumns: TableProps<Order>['columns'] = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '币种',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 80,
      sorter: (a, b) => a.cryptoType.localeCompare(b.cryptoType),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 80,
      filters: [
        { text: '买入', value: 'buy' },
        { text: '卖出', value: 'sell' },
      ],
      onFilter: (value, record) => record.direction === value,
      render: (direction) => (
        <Tag color={direction === 'buy' ? 'green' : 'red'}>
          {direction === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      key: 'orderType',
      width: 80,
      filters: [
        { text: '市价', value: 'market' },
        { text: '限价', value: 'limit' },
      ],
      onFilter: (value, record) => record.orderType === value,
      render: (type) => (type === 'market' ? '市价' : '限价'),
    },
    {
      title: '委托价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: '委托数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => amount.toFixed(4),
    },
    {
      title: '已成交',
      dataIndex: 'filledAmount',
      key: 'filledAmount',
      width: 100,
      sorter: (a, b) => a.filledAmount - b.filledAmount,
      render: (filled) => filled.toFixed(4),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '待成交', value: 'pending' },
        { text: '已成交', value: 'completed' },
        { text: '已取消', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const statusMap = {
          pending: <Tag color="blue">待成交</Tag>,
          completed: <Tag color="green">已成交</Tag>,
          cancelled: <Tag color="gray">已取消</Tag>,
        };
        return statusMap[status as keyof typeof statusMap];
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) =>
        record.status === 'pending' ? (
          <Button
            type="link"
            danger
            size="small"
            onClick={() => handleCancelOrder(record.id)}
          >
            取消
          </Button>
        ) : null,
    },
  ];

  // 交易记录表格列配置
  const tradeRecordColumns: TableProps<TradeRecord>['columns'] = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '币种',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 80,
      sorter: (a, b) => a.cryptoType.localeCompare(b.cryptoType),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 80,
      filters: [
        { text: '买入', value: 'buy' },
        { text: '卖出', value: 'sell' },
      ],
      onFilter: (value, record) => record.direction === value,
      render: (direction) => (
        <Tag color={direction === 'buy' ? 'green' : 'red'}>
          {direction === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '成交价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: '成交数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => amount.toFixed(4),
    },
    {
      title: '成交金额',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      sorter: (a, b) => a.total - b.total,
      render: (total) => `$${total.toLocaleString()}`,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
      sorter: (a, b) => a.fee - b.fee,
      render: (fee) => `$${fee.toFixed(2)}`,
    },
    {
      title: '盈亏',
      dataIndex: 'profitLoss',
      key: 'profitLoss',
      width: 120,
      sorter: (a, b) => (a.profitLoss || 0) - (b.profitLoss || 0),
      render: (pl) =>
        pl !== undefined ? (
          <Text type={pl >= 0 ? 'success' : 'danger'}>
            {pl >= 0 ? '+' : ''}{pl.toFixed(2)} USDT
          </Text>
        ) : (
          '-'
        ),
    },
    {
      title: '成交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 过滤订单
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status !== 'pending');

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2}>模拟交易</Title>
            <Text type="secondary">在无风险环境下练习数字货币交易</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新数据
            </Button>
            <Button danger onClick={handleResetAccount}>
              重置账户
            </Button>
          </Space>
        </div>

        {/* 账户概览 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ height: 120 }}>
              <Statistic
                title="可用余额 (USDT)"
                value={account?.balance || 0}
                precision={2}
                prefix={<WalletOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ height: 120 }}>
              <Statistic
                title="总资产估值 (USDT)"
                value={account?.totalAssets || 0}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ height: 120 }}>
              <Statistic
                title="总盈亏 (USDT)"
                value={account?.profitLoss || 0}
                precision={2}
                valueStyle={{ color: (account?.profitLoss || 0) >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={(account?.profitLoss || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ height: 120 }}>
              <Statistic
                title="收益率"
                value={account?.profitLossRate || 0}
                precision={2}
                valueStyle={{ color: (account?.profitLossRate || 0) >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={(account?.profitLossRate || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* 交易面板和持仓 */}
        <Row gutter={16} align="stretch">
          {/* 交易面板 */}
          <Col xs={24} lg={8} style={{ display: 'flex' }}>
            <Card
              title={
                <Space>
                  <SwapOutlined />
                  <span>交易面板</span>
                </Space>
              }
              style={{ width: '100%' }}
            >
              <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
                {/* 买卖方向 */}
                <Form.Item label="交易方向">
                  <Radio.Group
                    value={tradeDirection}
                    onChange={(e) => setTradeDirection(e.target.value)}
                    buttonStyle="solid"
                    style={{ width: '100%' }}
                  >
                    <Radio.Button value="buy" style={{ width: '50%', textAlign: 'center' }}>
                      买入
                    </Radio.Button>
                    <Radio.Button value="sell" style={{ width: '50%', textAlign: 'center' }}>
                      卖出
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {/* 币种选择 */}
                <Form.Item label="选择币种">
                  <Select
                    value={selectedCrypto}
                    onChange={setSelectedCrypto}
                    options={quotes.map(q => ({
                      value: q.symbol,
                      label: (
                        <Space>
                          <span>{q.symbol}</span>
                          <span style={{ color: '#999' }}>{q.name}</span>
                          <span style={{ color: q.changeRate24h >= 0 ? '#3f8600' : '#cf1322' }}>
                            ${q.price.toLocaleString()}
                          </span>
                        </Space>
                      ),
                    }))}
                  />
                </Form.Item>

                {/* 当前价格显示 */}
                {currentQuote && (
                  <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">当前价格</Text>
                        <Text strong>${currentQuote.price.toLocaleString()}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">24h涨跌</Text>
                        <Text type={currentQuote.changeRate24h >= 0 ? 'success' : 'danger'}>
                          {currentQuote.changeRate24h >= 0 ? '+' : ''}{currentQuote.changeRate24h.toFixed(2)}%
                        </Text>
                      </div>
                    </Space>
                  </div>
                )}

                {/* 订单类型 */}
                <Form.Item label="订单类型">
                  <Radio.Group
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <Radio value="market">市价单</Radio>
                    <Radio value="limit">限价单</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* 限价单价格 */}
                {orderType === 'limit' && (
                  <Form.Item
                    name="price"
                    label="委托价格"
                    rules={[{ required: true, message: '请输入委托价格' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      precision={2}
                      placeholder="输入委托价格"
                      addonAfter="USDT"
                    />
                  </Form.Item>
                )}

                {/* 数量 */}
                <Form.Item
                  name="amount"
                  label="交易数量"
                  rules={[{ required: true, message: '请输入交易数量' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={4}
                    placeholder="输入交易数量"
                    addonAfter={selectedCrypto}
                  />
                </Form.Item>

                <Divider />

                {/* 提交按钮 */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={orderLoading}
                    style={{
                      backgroundColor: tradeDirection === 'buy' ? '#52c41a' : '#ff4d4f',
                      borderColor: tradeDirection === 'buy' ? '#52c41a' : '#ff4d4f',
                    }}
                  >
                    {tradeDirection === 'buy' ? '买入' : '卖出'} {selectedCrypto}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 持仓列表 */}
          <Col xs={24} lg={16} style={{ display: 'flex' }}>
            <Card
              title={
                <Space>
                  <WalletOutlined />
                  <span>当前持仓</span>
                </Space>
              }
              style={{ width: '100%' }}
            >
              <Table
                columns={positionColumns}
                dataSource={positions.map(p => ({ ...p, key: p.cryptoType }))}
                loading={loading}
                pagination={{
                  pageSize: positionPageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                  showTotal: (total) => `共 ${total} 条`,
                  onShowSizeChange: (_, size) => setPositionPageSize(size),
                }}
                scroll={{ x: 800 }}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 订单和交易记录 */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'pending',
                label: (
                  <Space>
                    <OrderedListOutlined />
                    <span>未成交订单</span>
                    {pendingOrders.length > 0 && (
                      <Tag color="blue">{pendingOrders.length}</Tag>
                    )}
                  </Space>
                ),
                children: (
                  <Table
                    columns={orderColumns}
                    dataSource={pendingOrders.map(o => ({ ...o, key: o.id }))}
                    loading={loading}
                    pagination={{
                      pageSize: pendingOrderPageSize,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20'],
                      showTotal: (total) => `共 ${total} 条`,
                      showQuickJumper: true,
                      onShowSizeChange: (_, size) => setPendingOrderPageSize(size),
                    }}
                    scroll={{ x: 1100 }}
                    size="small"
                  />
                ),
              },
              {
                key: 'completed',
                label: (
                  <Space>
                    <OrderedListOutlined />
                    <span>已成交订单</span>
                  </Space>
                ),
                children: (
                  <Table
                    columns={orderColumns}
                    dataSource={completedOrders.map(o => ({ ...o, key: o.id }))}
                    loading={loading}
                    pagination={{
                      pageSize: completedOrderPageSize,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20'],
                      showTotal: (total) => `共 ${total} 条`,
                      showQuickJumper: true,
                      onShowSizeChange: (_, size) => setCompletedOrderPageSize(size),
                    }}
                    scroll={{ x: 1100 }}
                    size="small"
                  />
                ),
              },
              {
                key: 'records',
                label: (
                  <Space>
                    <HistoryOutlined />
                    <span>交易记录</span>
                  </Space>
                ),
                children: (
                  <Table
                    columns={tradeRecordColumns}
                    dataSource={tradeRecords.map(r => ({ ...r, key: r.id }))}
                    loading={loading}
                    pagination={{
                      pageSize: tradeRecordPageSize,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '50'],
                      showTotal: (total) => `共 ${total} 条`,
                      showQuickJumper: true,
                      onShowSizeChange: (_, size) => setTradeRecordPageSize(size),
                    }}
                    scroll={{ x: 1100 }}
                    size="small"
                  />
                ),
              },
            ]}
          />
        </Card>
      </Space>
    </div>
  );
};

export default SimulatedTrade;
