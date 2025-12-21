import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button, Typography, Space, Divider } from 'antd';
import { ArrowRightOutlined, BellOutlined, FileTextOutlined, DollarCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getSystemOverview } from '../api/system';
import type { SystemOverview } from '../types/system';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 状态管理
  const [overviewData, setOverviewData] = useState<SystemOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取系统概览数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSystemOverview();
        setOverviewData(response.data);
      } catch (error) {
        console.error('获取系统概览数据失败:', error);
        // 出错时使用模拟数据
        setOverviewData({
          unreadMessageCount: 12,
          pendingReportCount: 3,
          totalAssetValue: 10500000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>系统概览</Title>
          <Text type="secondary">欢迎使用AI驱动数字货币投资辅助系统</Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="未读消息"
                value={overviewData?.unreadMessageCount || 0}
                prefix={<BellOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Link to="/messages">
                <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }}>
                  查看所有消息
                </Button>
              </Link>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="待审核报告"
                value={overviewData?.pendingReportCount || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Link to="/reports">
                <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }}>
                  查看报告列表
                </Button>
              </Link>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card hoverable loading={loading}>
              <Statistic
                title="总资产估值"
                value={overviewData?.totalAssetValue || 0}
                prefix={<DollarCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Link to="/portfolio">
                <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }}>
                  查看持仓详情
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>

        <div>
          <Title level={3}>系统功能</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable bodyStyle={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <BellOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  <Title level={4}>消息采集</Title>
                  <Text type="secondary">每日自动采集市场消息</Text>
                  <Link to="/messages">
                    <Button type="primary" size="small">
                      查看
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable bodyStyle={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <DollarCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                  <Title level={4}>持仓管理</Title>
                  <Text type="secondary">实时监控资产配置</Text>
                  <Link to="/portfolio">
                    <Button type="primary" size="small">
                      查看
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable bodyStyle={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <FileTextOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                  <Title level={4}>AI分析</Title>
                  <Text type="secondary">智能生成投资建议</Text>
                  <Link to="/reports">
                    <Button type="primary" size="small">
                      查看
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable bodyStyle={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <BarChartOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />
                  <Title level={4}>价格排行</Title>
                  <Text type="secondary">实时查看数字货币价格排名</Text>
                  <Link to="/rankings">
                    <Button type="primary" size="small">
                      查看
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card hoverable bodyStyle={{ textAlign: 'center' }}>
                <Space direction="vertical" size="middle">
                  <FileTextOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                  <Title level={4}>审核管理</Title>
                  <Text type="secondary">审核AI生成的建议</Text>
                  <Link to="/reports">
                    <Button type="primary" size="small">
                      查看
                    </Button>
                  </Link>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Space>
    </div>
  );
};

export default Dashboard;