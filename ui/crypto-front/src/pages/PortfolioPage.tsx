import React, { useMemo } from 'react';
import { Card, Typography, Space, Button, Table } from 'antd';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAxios } from '../hooks/useAxios';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;

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

// API响应类型定义
interface CurrentPortfolioResponse {
  totalValue: number;
  items: PortfolioItem[];
}

// ECharts Tooltip参数类型
interface EChartsTooltipParam {
  axisValue: string;
  marker: string;
  seriesName: string;
  value: number;
}

const PortfolioPage: React.FC = () => {
  // 缓存请求配置，确保引用稳定
  const historyConfig = useMemo(() => ({
    params: { days: 7 },
  }), []);

  // 使用自定义Hook获取当前持仓数据
  const { data: currentData, loading: currentLoading, refetch: refetchCurrent } = useAxios<CurrentPortfolioResponse>('portfolio/current');

  // 使用自定义Hook获取历史持仓数据
  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useAxios<HistoricalPortfolio[]>('portfolio/history', historyConfig);

  // 使用useMemo确保引用稳定，避免不必要的重新渲染
  const currentPortfolio = useMemo(() => currentData?.items || [], [currentData]);
  const historicalPortfolio = useMemo(() => historyData || [], [historyData]);
  const totalValue = useMemo(() => currentData?.totalValue || 0, [currentData]);

  // 饼图配置
  const pieChartOption = useMemo(() => ({
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
        data: currentPortfolio.length > 0 ? currentPortfolio.map((item: PortfolioItem) => ({
          value: item.percentage || 0,
          name: item.cryptoType || '未知',
        })) : [],
      },
    ],
  }), [currentPortfolio]);

  // 折线图配置
  const lineChartOption = useMemo(() => ({
    title: {
      text: '近7日总资产变化',
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: EChartsTooltipParam[]) => {
        if (!params || params.length === 0) return '';
        let result = params[0].axisValue + '<br/>';
        params.forEach((param: EChartsTooltipParam) => {
<<<<<<< HEAD
          result += `${param.marker}${param.seriesName}: $${(param.value || 0).toLocaleString()}<br/>`;
=======
          result += `${param.marker}${param.seriesName}: $${param.value?.toLocaleString() || 0}<br/>`;
>>>>>>> 010f0c3 (dify联调)
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
      data: historicalPortfolio.map((item: HistoricalPortfolio) => item.date || ''),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `$${value?.toLocaleString() || 0}`,
      },
    },
    series: [
      {
        name: '总资产',
        type: 'line',
        stack: 'Total',
        data: historicalPortfolio.map((item: HistoricalPortfolio) => item.totalValue || 0),
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
  }), [historicalPortfolio]);

  // 缓存表格列配置，避免每次渲染重建
  const columns = useMemo<TableProps<PortfolioItem>['columns']>(() => [
    {
      title: '数字货币',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      render: (text) => <Text strong>{text || '-'}</Text>,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
<<<<<<< HEAD
      render: (amount) => amount ? amount.toFixed(2) : '0.00',
=======
      render: (amount) => (amount || 0).toFixed(2), // 修复空值toFixed报错
>>>>>>> 010f0c3 (dify联调)
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      key: 'price',
<<<<<<< HEAD
      render: (price) => price ? `$${price.toLocaleString()}` : '$0.00',
=======
      render: (price) => `$${(price || 0).toLocaleString()}`,
>>>>>>> 010f0c3 (dify联调)
    },
    {
      title: '市值',
      dataIndex: 'value',
      key: 'value',
<<<<<<< HEAD
      render: (value) => value ? `$${value.toLocaleString()}` : '$0.00',
=======
      render: (value) => `$${(value || 0).toLocaleString()}`,
>>>>>>> 010f0c3 (dify联调)
      sorter: (a, b) => (a.value || 0) - (b.value || 0),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
<<<<<<< HEAD
      render: (percentage) => percentage ? `${percentage.toFixed(2)}%` : '0.00%',
=======
      render: (percentage) => `${(percentage || 0).toFixed(2)}%`,
>>>>>>> 010f0c3 (dify联调)
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ], []);

  // 导出数据功能
  const handleExport = () => {
    // 实际项目中会调用后端API导出数据
    console.log('导出持仓数据');
  };

  return (
    <div style={{ padding: '24px' }}>
<<<<<<< HEAD
=======
      {/* 替换direction为orientation，修复antd警告 */}
>>>>>>> 010f0c3 (dify联调)
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>持仓数据</Title>
          <Text type="secondary">查看当前资产配置和历史变化</Text>
        </div>

        {/* 总资产概览 */}
        <Card>
<<<<<<< HEAD
=======
          {/* 替换direction为orientation */}
>>>>>>> 010f0c3 (dify联调)
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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
            // 空数据提示
            locale={{ emptyText: '暂无持仓数据' }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default PortfolioPage;