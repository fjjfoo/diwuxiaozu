import React from 'react';
import { Card, Typography, Space, Button, Table } from 'antd';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAxios } from '../hooks/useAxios';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

// 持仓数据类型定义
interface PortfolioItem {
  id: number;
  cryptoType: string;
  amount: number;
  price: number;
  value: number;
  percentage: number;
  updatedAt: string;
}

// 历史持仓数据类型定义
interface HistoricalPortfolio {
  date: string;
  totalValue: number;
  items: Array<{
    cryptoType: string;
    percentage: number;
  }>;
}

const PortfolioPage: React.FC = () => {
  // 使用自定义Hook获取当前持仓数据
  const { data: currentData, loading: currentLoading, refetch: refetchCurrent } = useAxios('/api/portfolio/current');

  // 使用自定义Hook获取历史持仓数据
  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useAxios('/api/portfolio/history', {
    params: {
      days: 7,
    },
  });

  // 模拟当前持仓数据
  const mockCurrentPortfolio: PortfolioItem[] = [
    {
      id: 1,
      cryptoType: 'BTC',
      amount: 15.2,
      price: 45000,
      value: 684000,
      percentage: 42.75,
      updatedAt: '2024-01-15T10:00:00',
    },
    {
      id: 2,
      cryptoType: 'ETH',
      amount: 520.5,
      price: 2300,
      value: 1197150,
      percentage: 32.81,
      updatedAt: '2024-01-15T10:00:00',
    },
    {
      id: 3,
      cryptoType: 'SOL',
      amount: 3500,
      price: 85,
      value: 297500,
      percentage: 18.59,
      updatedAt: '2024-01-15T10:00:00',
    },
    {
      id: 4,
      cryptoType: 'USDT',
      amount: 100000,
      price: 1,
      value: 100000,
      percentage: 5.85,
      updatedAt: '2024-01-15T10:00:00',
    },
  ];

  // 模拟历史持仓数据
  const mockHistoricalData: HistoricalPortfolio[] = [
    { date: '2024-01-09', totalValue: 1020000, items: [{ cryptoType: 'BTC', percentage: 40 }, { cryptoType: 'ETH', percentage: 35 }, { cryptoType: 'SOL', percentage: 15 }, { cryptoType: 'USDT', percentage: 10 }] },
    { date: '2024-01-10', totalValue: 1035000, items: [{ cryptoType: 'BTC', percentage: 40.5 }, { cryptoType: 'ETH', percentage: 34.8 }, { cryptoType: 'SOL', percentage: 15.2 }, { cryptoType: 'USDT', percentage: 9.5 }] },
    { date: '2024-01-11', totalValue: 1042000, items: [{ cryptoType: 'BTC', percentage: 41 }, { cryptoType: 'ETH', percentage: 34.5 }, { cryptoType: 'SOL', percentage: 15.5 }, { cryptoType: 'USDT', percentage: 9 }] },
    { date: '2024-01-12', totalValue: 1038000, items: [{ cryptoType: 'BTC', percentage: 41.5 }, { cryptoType: 'ETH', percentage: 34.2 }, { cryptoType: 'SOL', percentage: 15.8 }, { cryptoType: 'USDT', percentage: 8.5 }] },
    { date: '2024-01-13', totalValue: 1045000, items: [{ cryptoType: 'BTC', percentage: 42 }, { cryptoType: 'ETH', percentage: 33.8 }, { cryptoType: 'SOL', percentage: 16.2 }, { cryptoType: 'USDT', percentage: 8 }] },
    { date: '2024-01-14', totalValue: 1050000, items: [{ cryptoType: 'BTC', percentage: 42.5 }, { cryptoType: 'ETH', percentage: 33.5 }, { cryptoType: 'SOL', percentage: 17 }, { cryptoType: 'USDT', percentage: 7 }] },
    { date: '2024-01-15', totalValue: 1060000, items: [{ cryptoType: 'BTC', percentage: 42.75 }, { cryptoType: 'ETH', percentage: 32.81 }, { cryptoType: 'SOL', percentage: 18.59 }, { cryptoType: 'USDT', percentage: 5.85 }] },
  ];

  const currentPortfolio = currentData?.items || mockCurrentPortfolio;
  const historicalPortfolio = historyData?.data || mockHistoricalData;
  const totalValue = currentPortfolio.reduce((sum: number, item: PortfolioItem) => sum + item.value, 0);

  // 饼图配置
  const pieChartOption = {
    title: {
      text: '当前资产配置',
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: currentPortfolio.map((item: PortfolioItem) => item.cryptoType),
    },
    series: [
      {
        name: '资产配置',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: currentPortfolio.map((item: PortfolioItem) => ({
          value: item.percentage,
          name: item.cryptoType,
        })),
      },
    ],
  };

  // 折线图配置
  const lineChartOption = {
    title: {
      text: '近7日总资产变化',
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = params[0].axisValue + '<br/>';
        params.forEach((param: any) => {
          result += `${param.marker}${param.seriesName}: $${param.value.toLocaleString()}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ['总资产'],
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: historicalPortfolio.map((item: HistoricalPortfolio) => item.date),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
      },
    },
    series: [
      {
        name: '总资产',
        type: 'line',
        stack: 'Total',
        data: historicalPortfolio.map((item: HistoricalPortfolio) => item.totalValue),
        smooth: true,
        itemStyle: {
          color: '#1677ff',
        },
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
      },
    ],
  };

  // 表格列配置
  const columns: TableProps<PortfolioItem>['columns'] = [
    {
      title: '数字货币',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toFixed(2),
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: '市值',
      dataIndex: 'value',
      key: 'value',
      render: (value) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => `${percentage.toFixed(2)}%`,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  // 导出数据功能
  const handleExport = () => {
    // 实际项目中会调用后端API导出数据
    console.log('导出持仓数据');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>持仓数据</Title>
          <Text type="secondary">查看当前资产配置和历史变化</Text>
        </div>

        {/* 总资产概览 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>总资产估值：</Text>
                <Text strong style={{ fontSize: 24, marginLeft: 8 }}>
                  ${totalValue.toLocaleString()}
                </Text>
              </div>
              <Space size="middle">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    refetchCurrent();
                    refetchHistory();
                  }}
                  loading={currentLoading || historyLoading}
                >
                  刷新
                </Button>
                <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                  导出数据
                </Button>
              </Space>
            </div>
          </Space>
        </Card>

        {/* 图表区域 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card loading={currentLoading}>
            <ReactECharts option={pieChartOption} style={{ height: 400 }} />
          </Card>
          <Card loading={historyLoading}>
            <ReactECharts option={lineChartOption} style={{ height: 400 }} />
          </Card>
        </div>

        {/* 当前持仓表格 */}
        <Card title="当前持仓明细">
          <Table
              columns={columns}
              dataSource={currentPortfolio.map((item: PortfolioItem) => ({ ...item, key: item.id }))}
              pagination={false}
              loading={currentLoading}
            />
        </Card>
      </Space>
    </div>
  );
};

export default PortfolioPage;