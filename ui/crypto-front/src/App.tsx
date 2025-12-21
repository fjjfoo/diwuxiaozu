import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, MessageOutlined, DollarOutlined, FileTextOutlined, BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import MessageList from './pages/MessageList';
import PortfolioPage from './pages/PortfolioPage';
import ReportList from './pages/ReportList';
import PriceRankings from './pages/PriceRankings';
import MarketTrends from './pages/MarketTrends';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const location = useLocation();

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">系统概览</Link>,
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: <Link to="/messages">消息列表</Link>,
    },
    {
      key: '/portfolio',
      icon: <DollarOutlined />,
      label: <Link to="/portfolio">持仓数据</Link>,
    },
    {
      key: '/rankings',
      icon: <BarChartOutlined />,
      label: <Link to="/rankings">价格排行</Link>,
    },
    {
      key: '/trends',
      icon: <LineChartOutlined />,
      label: <Link to="/trends">市场趋势</Link>,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link to="/reports">建议报告</Link>,
    },
  ];

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677FF',
          borderRadius: 4,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" style={{ 
            height: 32, 
            margin: 16, 
            background: 'rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            lineHeight: '32px',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            AI投资助手
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ 
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px'
          }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1677FF' }}>
              AI驱动数字货币投资辅助系统
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>管理员</span>
            </div>
          </Header>
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/messages" element={<MessageList />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/rankings" element={<PriceRankings />} />
              <Route path="/trends" element={<MarketTrends />} />
              <Route path="/reports" element={<ReportList />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;