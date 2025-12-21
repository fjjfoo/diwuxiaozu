import React, { useState } from 'react';
import { Card, Table, Typography, Space, Button, Select, DatePicker, Tag, Modal } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAxios } from '../hooks/useAxios';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 消息类型定义
interface Message {
  id: number;
  cryptoType: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  sourceUrl: string;
  createdAt: string;
  isRead: boolean;
}

// API响应类型定义
interface MessagesResponse {
  total: number;
  pages: number;
  current: number;
  records: Message[];
}

const MessageList: React.FC = () => {
  // 筛选条件
  const [cryptoType, setCryptoType] = useState<string>('');
  const [sentiment, setSentiment] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 使用useMemo记忆化请求参数，避免每次渲染都重新创建对象
  const requestParams = React.useMemo(() => ({
    params: {
      cryptoType,
      sentiment,
      startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
      endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
    },
  }), [cryptoType, sentiment, dateRange]);

  // 使用自定义Hook获取消息数据
  const { data, loading, refetch } = useAxios<MessagesResponse>('/messages', requestParams);

  const messages = data?.records || [];

  // 情感标签映射
  const sentimentTagMap = {
    positive: <Tag color="green">利好</Tag>,
    negative: <Tag color="red">利空</Tag>,
    neutral: <Tag color="gray">中性</Tag>,
  };

  // 表格列配置
  const columns: TableProps<Message>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '数字货币',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Text ellipsis={true}>
          {text}
        </Text>
      ),
    },
    {
      title: '情感倾向',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 120,
      render: (sentiment) => sentimentTagMap[sentiment as keyof typeof sentimentTagMap],
      filters: [
        { text: '利好', value: 'positive' },
        { text: '利空', value: 'negative' },
        { text: '中性', value: 'neutral' },
      ],
      onFilter: (value, record) => record.sentiment === value,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '状态',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 100,
      render: (isRead) => (
        <Tag color={isRead ? 'default' : 'blue'}>
          {isRead ? '已读' : '未读'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setCurrentMessage(record);
              setModalVisible(true);
            }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>市场消息列表</Title>
          <Text type="secondary">查看最新的数字货币市场消息</Text>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 筛选条件 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <Text strong>数字货币类型：</Text>
              <Select
                style={{ width: 150 }}
                placeholder="选择数字货币"
                value={cryptoType}
                onChange={setCryptoType}
                allowClear
              >
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
                <Option value="SOL">SOL</Option>
                <Option value="USDT">USDT</Option>
              </Select>

              <Text strong>情感倾向：</Text>
              <Select
                style={{ width: 150 }}
                placeholder="选择情感倾向"
                value={sentiment}
                onChange={setSentiment}
                allowClear
              >
                <Option value="positive">利好</Option>
                <Option value="negative">利空</Option>
                <Option value="neutral">中性</Option>
              </Select>

              <Text strong>时间范围：</Text>
              <RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                  style={{ width: 300 }}
                />

              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => {
                  setCryptoType('');
                  setSentiment('');
                  setDateRange(null);
                  refetch();
                }}
              >
                重置
              </Button>

              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                loading={loading}
              >
                刷新
              </Button>
            </div>

            {/* 消息表格 */}
            <Table
              columns={columns}
              dataSource={messages.map((message: Message) => ({ ...message, key: message.id }))}
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Space>
        </Card>
      </Space>

      {/* 消息详情模态框 */}
      <Modal
        title="消息详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {currentMessage && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>数字货币类型：</Text>
              <Text strong style={{ marginLeft: 8 }}>
                {currentMessage.cryptoType}
              </Text>
            </div>
            <div>
              <Text strong>情感倾向：</Text>
              {sentimentTagMap[currentMessage.sentiment as keyof typeof sentimentTagMap]}
            </div>
            <div>
              <Text strong>消息内容：</Text>
              <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {currentMessage.content}
              </div>
            </div>
            <div>
              <Text strong>消息来源：</Text>
              <a
                href={currentMessage.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 8 }}
              >
                {currentMessage.source}
              </a>
            </div>
            <div>
              <Text strong>发布时间：</Text>
              <Text style={{ marginLeft: 8 }}>
                {dayjs(currentMessage.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default MessageList;