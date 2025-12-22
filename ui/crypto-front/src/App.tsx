import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, MessageOutlined, DollarOutlined, FileTextOutlined, BarChartOutlined, FireOutlined, BookOutlined, TeamOutlined ,ExperimentOutlined} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import MessageList from './pages/MessageList';
import PortfolioPage from './pages/PortfolioPage';
import ReportList from './pages/ReportList';
import PriceRankings from './pages/PriceRankings';
import MarketTrends from './pages/MarketTrends';
import CryptoDetail from './pages/CryptoDetail';
import HotCryptoPage from './pages/HotCryptoPage';
import SimulatedTrade from './pages/SimulatedTrade';
import StrategyListPage from './pages/StrategyListPage';
import StrategyDetail from './pages/StrategyDetail';
import CommunityPage from './pages/CommunityPage';
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
      key: '/hot-crypto',
      icon: <FireOutlined />,
      label: <Link to="/hot-crypto">热门货币</Link>,
    },
    {
      key: '/trends',
      icon: <BarChartOutlined />,
      label: <Link to="/trends">市场趋势</Link>,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link to="/reports">建议报告</Link>,
    },
    {
      key: '/simulated-trade',
      icon: <ExperimentOutlined />,
      label: <Link to="/simulated-trade">模拟交易</Link>,
    },
    {
      key: '/social/strategies',
      icon: <BookOutlined />,
      label: <Link to="/social/strategies">投资策略</Link>,
    },
    {
      key: '/social/community',
      icon: <TeamOutlined />,
      label: <Link to="/social/community">投资社区</Link>,
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
              <Route path="/hot-crypto" element={<HotCryptoPage />} />
              <Route path="/reports" element={<ReportList />} />
              <Route path="/simulated-trade" element={<SimulatedTrade />} />
              <Route path="/crypto/:id" element={<CryptoDetail />} />
              <Route path="/strategies/:id" element={<StrategyDetail />} />
              <Route path="/social/strategies" element={<StrategyListPage />} />
              <Route path="/social/community" element={<CommunityPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;