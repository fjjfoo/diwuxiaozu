import React, { useState } from 'react';
import { Card, Table, Typography, Space, Button, Tag, Modal, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAxios } from '../hooks/useAxios';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// 报告类型定义
interface Report {
  id: number;
  reportDate: string;
  status: 'pending' | 'approved' | 'rejected';
  aiAgentId: string;
  generatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// 报告详情类型定义
interface ReportDetail extends Report {
  messageAnalysis: Array<{
    messageId: number;
    cryptoType: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    content: string;
    impact: string;
  }>;
  portfolioSnapshot: Array<{
    cryptoType: string;
    amount: number;
    percentage: number;
    value: number;
  }>;
  recommendation: {
    overallAssessment: string;
    adjustments: Array<{
      cryptoType: string;
      currentPercentage: number;
      recommendedPercentage: number;
      reason: string;
    }>;
    conclusion: string;
  };
}

const ReportList: React.FC = () => {
  // 使用自定义Hook获取报告列表数据
  const { data: reportData, loading: reportLoading, refetch: refetchReports } = useAxios('/api/reports');

  // 报告详情相关状态
  const [currentReport, setCurrentReport] = useState<ReportDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 模拟报告列表数据
  const mockReports: Report[] = [
    {
      id: 1,
      reportDate: '2024-01-15',
      status: 'pending',
      aiAgentId: 'agent-001',
      generatedAt: '2024-01-15T09:30:00',
    },
    {
      id: 2,
      reportDate: '2024-01-14',
      status: 'approved',
      aiAgentId: 'agent-001',
      generatedAt: '2024-01-14T09:30:00',
      reviewedBy: 'admin',
      reviewedAt: '2024-01-14T11:20:00',
    },
    {
      id: 3,
      reportDate: '2024-01-13',
      status: 'rejected',
      aiAgentId: 'agent-001',
      generatedAt: '2024-01-13T09:30:00',
      reviewedBy: 'admin',
      reviewedAt: '2024-01-13T10:45:00',
      rejectionReason: '建议调整幅度过大，需要重新评估',
    },
  ];

  // 模拟报告详情数据
  const mockReportDetail: ReportDetail = {
    id: 1,
    reportDate: '2024-01-15',
    status: 'pending',
    aiAgentId: 'agent-001',
    generatedAt: '2024-01-15T09:30:00',
    messageAnalysis: [
      {
        messageId: 1,
        cryptoType: 'BTC',
        sentiment: 'positive',
        content: '美联储加息预期减弱，比特币价格突破45000美元',
        impact: '短期利好，预计价格将继续上涨',
      },
      {
        messageId: 2,
        cryptoType: 'ETH',
        sentiment: 'positive',
        content: '以太坊上海升级顺利完成，质押解锁功能启动',
        impact: '长期利好，提高网络安全性和去中心化程度',
      },
      {
        messageId: 3,
        cryptoType: 'SOL',
        sentiment: 'negative',
        content: 'Solana网络出现短暂拥堵，影响交易确认速度',
        impact: '短期利空，可能影响投资者信心',
      },
    ],
    portfolioSnapshot: [
      { cryptoType: 'BTC', amount: 15.2, percentage: 42.75, value: 684000 },
      { cryptoType: 'ETH', amount: 520.5, percentage: 32.81, value: 1197150 },
      { cryptoType: 'SOL', amount: 3500, percentage: 18.59, value: 297500 },
      { cryptoType: 'USDT', amount: 100000, percentage: 5.85, value: 100000 },
    ],
    recommendation: {
      overallAssessment: '当前持仓配置基本合理，但可根据市场消息进行微调，以优化收益并降低风险',
      adjustments: [
        {
          cryptoType: 'BTC',
          currentPercentage: 42.75,
          recommendedPercentage: 45,
          reason: '受美联储加息预期减弱影响，比特币价格有望继续上涨，建议适当增加配置',
        },
        {
          cryptoType: 'ETH',
          currentPercentage: 32.81,
          recommendedPercentage: 30,
          reason: '以太坊长期前景良好，但短期涨幅可能有限，建议略微降低配置',
        },
        {
          cryptoType: 'SOL',
          currentPercentage: 18.59,
          recommendedPercentage: 15,
          reason: 'Solana网络稳定性问题可能影响短期表现，建议降低配置以控制风险',
        },
        {
          cryptoType: 'USDT',
          currentPercentage: 5.85,
          recommendedPercentage: 10,
          reason: '保留足够的稳定币以应对市场波动，提高资金灵活性',
        },
      ],
      conclusion: '建议根据上述调整方案更新持仓配置，以适应当前市场环境并优化投资组合表现。调整后应密切关注市场动态，及时进行再平衡。',
    },
  };

  const reports = reportData?.data || mockReports;

  // 状态标签映射
  const statusTagMap = {
    pending: <Tag color="blue">待审核</Tag>,
    approved: <Tag color="green">已通过</Tag>,
    rejected: <Tag color="red">已驳回</Tag>,
  };

  // 表格列配置
  const columns: TableProps<Report>['columns'] = [
    {
      title: '报告ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '报告日期',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 120,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => statusTagMap[status as keyof typeof statusTagMap],
      filters: [
        { text: '待审核', value: 'pending' },
        { text: '已通过', value: 'approved' },
        { text: '已驳回', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'AI智能体ID',
      dataIndex: 'aiAgentId',
      key: 'aiAgentId',
      width: 150,
    },
    {
      title: '生成时间',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
      width: 180,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
    },
    {
      title: '审核人',
      dataIndex: 'reviewedBy',
      key: 'reviewedBy',
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      width: 180,
      render: (date) => date && dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.id)}
          >
            查看详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 查看报告详情
  const handleViewDetail = (_reportId: number) => {
    // 实际项目中会调用API获取报告详情
    // 这里使用模拟数据
    setCurrentReport(mockReportDetail);
    setModalVisible(true);
  };

  // 审批报告
  const handleApprove = (_reportId: number) => {
    // 实际项目中会调用API审批报告
    Modal.confirm({
      title: '确认审批',
      content: '确定要通过这份报告吗？通过后将自动更新持仓数据。',
      onOk: async () => {
        try {
          // 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1000));
          message.success('报告审批通过');
          refetchReports();
        } catch (error) {
          message.error('审批失败，请重试');
        }
      },
    });
  };

  // 驳回报告
  const handleReject = (_reportId: number) => {
    // 实际项目中会调用API驳回报告
    Modal.confirm({
      title: '确认驳回',
      content: '确定要驳回这份报告吗？',
      onOk: async () => {
        try {
          // 模拟API调用
          await new Promise((resolve) => setTimeout(resolve, 1000));
          message.success('报告已驳回');
          refetchReports();
        } catch (error) {
          message.error('驳回失败，请重试');
        }
      },
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>建议报告</Title>
          <Text type="secondary">查看AI生成的投资建议并进行审核</Text>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 报告列表表格 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={refetchReports}
                loading={reportLoading}
              >
                刷新
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={reports.map((report: Report) => ({ ...report, key: report.id }))}
              loading={reportLoading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Space>
        </Card>
      </Space>

      {/* 报告详情模态框 */}
      <Modal
        title="报告详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={900}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {currentReport && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 报告基本信息 */}
            <Card size="small" title="报告基本信息">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  <div>
                    <Text strong>报告ID：</Text>
                    <Text>{currentReport.id}</Text>
                  </div>
                  <div>
                    <Text strong>报告日期：</Text>
                    <Text>{dayjs(currentReport.reportDate).format('YYYY-MM-DD')}</Text>
                  </div>
                  <div>
                    <Text strong>状态：</Text>
                    {statusTagMap[currentReport.status as keyof typeof statusTagMap]}
                  </div>
                  <div>
                    <Text strong>生成时间：</Text>
                    <Text>{dayjs(currentReport.generatedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </div>
                  {currentReport.status !== 'pending' && (
                    <div>
                      <Text strong>审核人：</Text>
                      <Text>{currentReport.reviewedBy}</Text>
                    </div>
                  )}
                  {currentReport.status !== 'pending' && (
                    <div>
                      <Text strong>审核时间：</Text>
                      <Text>{dayjs(currentReport.reviewedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </div>
                  )}
                  {currentReport.status === 'rejected' && (
                    <div>
                      <Text strong>驳回原因：</Text>
                      <Text type="danger">{currentReport.rejectionReason}</Text>
                    </div>
                  )}
                </div>
              </Space>
            </Card>

            {/* 消息分析结果 */}
            <Card size="small" title="消息分析结果">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {currentReport.messageAnalysis.map((analysis) => (
                  <Card key={analysis.messageId} size="small" style={{ backgroundColor: '#f9f9f9' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <Text strong>数字货币：</Text>
                        <Text strong>{analysis.cryptoType}</Text>
                        <Text strong>情感倾向：</Text>
                        <Tag color={
                          analysis.sentiment === 'positive' ? 'green' :
                          analysis.sentiment === 'negative' ? 'red' : 'gray'
                        }>
                          {analysis.sentiment === 'positive' ? '利好' :
                           analysis.sentiment === 'negative' ? '利空' : '中性'}
                        </Tag>
                      </div>
                      <div>
                        <Text strong>消息内容：</Text>
                        <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#fff', borderRadius: 4 }}>
                          {analysis.content}
                        </div>
                      </div>
                      <div>
                        <Text strong>影响分析：</Text>
                        <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#fff', borderRadius: 4 }}>
                          {analysis.impact}
                        </div>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>

            {/* 持仓快照 */}
            <Card size="small" title="持仓快照">
              <Table
                columns={[
                  { title: '数字货币', dataIndex: 'cryptoType', key: 'cryptoType' },
                  { title: '数量', dataIndex: 'amount', key: 'amount', render: (amount: number) => amount.toFixed(2) },
                  { title: '占比', dataIndex: 'percentage', key: 'percentage', render: (pct: number) => `${pct.toFixed(2)}%` },
                  { title: '价值', dataIndex: 'value', key: 'value', render: (value: number) => `$${value.toLocaleString()}` },
                ]}
                dataSource={currentReport.portfolioSnapshot.map((item) => ({ ...item, key: item.cryptoType }))}
                pagination={false}
                scroll={{ x: 400 }}
              />
            </Card>

            {/* AI建议 */}
            <Card size="small" title="AI投资建议">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>整体评估：</Text>
                  <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: 4 }}>
                    {currentReport.recommendation.overallAssessment}
                  </div>
                </div>

                <div>
                  <Text strong>调整建议：</Text>
                  <Table
                    columns={[
                      { title: '数字货币', dataIndex: 'cryptoType', key: 'cryptoType' },
                      { title: '当前占比', dataIndex: 'currentPercentage', key: 'currentPercentage', render: (pct: number) => `${pct.toFixed(2)}%` },
                      { title: '建议占比', dataIndex: 'recommendedPercentage', key: 'recommendedPercentage', render: (pct: number) => `${pct.toFixed(2)}%` },
                      { title: '调整原因', dataIndex: 'reason', key: 'reason' },
                    ]}
                    dataSource={currentReport.recommendation.adjustments.map((adj) => ({ ...adj, key: adj.cryptoType }))}
                    pagination={false}
                    scroll={{ x: 600 }}
                  />
                </div>

                <div>
                  <Text strong>结论：</Text>
                  <div style={{ margin: '8px 0', padding: '12px', backgroundColor: '#f6ffed', borderRadius: 4 }}>
                    {currentReport.recommendation.conclusion}
                  </div>
                </div>
              </Space>
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default ReportList;