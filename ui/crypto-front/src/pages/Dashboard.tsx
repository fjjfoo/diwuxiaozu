import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Button, Typography, Space, Divider } from 'antd';
import { ArrowRightOutlined, BellOutlined, FileTextOutlined, DollarCircleOutlined, BarChartOutlined, FireOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getSystemOverview } from '../api/system';
import type { SystemOverview } from '../types/system';

const { Title, Text } = Typography;

// 样式常量
const CARD_STYLE = {
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease'
};

const SPACE_STYLE = {
  width: '100%',
  paddingBottom: '8px'
};

const DIVIDER_STYLE = {
  margin: '12px 0'
};

const DEFAULT_SIMULATION_DATA: SystemOverview = {
  unreadMessageCount: 12,
  pendingReportCount: 3,
  totalAssetValue: 10500000
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link, color }) => {
  return (
    <Col xs={24} sm={12} md={6}>
      <Card hoverable className="feature-card">
        <Space orientation="vertical" size="middle" style={SPACE_STYLE}>
          <div style={{ color }}>{icon}</div>
          <Title level={4}>{title}</Title>
          <Text type="secondary">{description}</Text>
          <Link to={link} style={{ textDecoration: 'none' }}>
            <Button type="primary" size="middle">
              查看
            </Button>
          </Link>
        </Space>
      </Card>
    </Col>
  );
};

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
      } catch {
        // 错误日志已移除
        // 出错时使用模拟数据
        setOverviewData(DEFAULT_SIMULATION_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>系统概览</Title>
          <Text type="secondary">欢迎使用AI驱动数字货币投资辅助系统</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              loading={loading}
              style={CARD_STYLE}
            >
              <Statistic
                title="未读消息"
                value={overviewData?.unreadMessageCount || 0}
                prefix={<BellOutlined />}
                styles={{ content: { color: '#52c41a' } }}
              />
              <Divider style={DIVIDER_STYLE} />
              <Link to="/messages">
                <Button type="link" icon={<ArrowRightOutlined />} style={{ padding: 0 }}>
                  查看所有消息
                </Button>
              </Link>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              loading={loading}
              style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', transition: 'all 0.3s ease' }}
            >
              <Statistic
                title="待审核报告"
                value={overviewData?.pendingReportCount || 0}
                prefix={<FileTextOutlined />}
                styles={{ content: { color: '#1890ff' } }}
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
            <Card 
              hoverable 
              loading={loading}
              style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', transition: 'all 0.3s ease' }}
            >
              <Statistic
                title="总资产估值"
                value={overviewData?.totalAssetValue || 0}
                prefix={<DollarCircleOutlined />}
                styles={{ content: { color: '#f5222d' } }}
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
          <Row gutter={[24, 24]}>
            <FeatureCard
              icon={<BellOutlined />}
              title="消息采集"
              description="每日自动采集市场消息"
              link="/messages"
              color="#1890ff"
            />
            <FeatureCard
              icon={<DollarCircleOutlined />}
              title="持仓管理"
              description="实时监控资产配置"
              link="/portfolio"
              color="#52c41a"
            />
            <FeatureCard
              icon={<FileTextOutlined />}
              title="AI分析"
              description="智能生成投资建议"
              link="/reports"
              color="#faad14"
            />
            <FeatureCard
              icon={<BarChartOutlined />}
              title="价格排行"
              description="实时查看数字货币价格排名"
              link="/rankings"
              color="#eb2f96"
            />
            <FeatureCard
              icon={<FireOutlined />}
              title="热门货币"
              description="查看热门加密货币行情"
              link="/hot-crypto"
              color="#fa541c"
            />
            <FeatureCard
              icon={<FileTextOutlined />}
              title="审核管理"
              description="审核AI生成的建议"
              link="/reports"
              color="#722ed1"
            />
            <FeatureCard
              icon={<BarChartOutlined />}
              title="市场趋势"
              description="分析数字货币市场走势"
              link="/trends"
              color="#13c2c2"
            />
            <FeatureCard
              icon={<ExperimentOutlined />}
              title="模拟交易"
              description="练习数字货币交易策略"
              link="/simulated-trade"
              color="#eb2f96"
            />
          </Row>
        </div>
      </Space>
    </div>
  );
};

export default Dashboard;