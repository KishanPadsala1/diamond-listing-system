import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AppLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'brokers';

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white flex items-center px-6 shadow-md">
        <Title level={3} className="m-0 text-blue-600">
          Diamond Listing System
        </Title>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            className="h-full border-r-0"
            items={[
              {
                key: 'brokers',
                icon: <UserOutlined />,
                label: <Link to="/brokers">Brokers</Link>,
              },
              {
                key: 'diamonds',
                icon: <DollarOutlined />,
                label: <Link to="/diamonds">Diamonds</Link>,
              },
              {
                key: 'transactions',
                icon: <ShoppingCartOutlined />,
                label: <Link to="/transactions">Transactions</Link>,
              },
            ]}
          />
        </Sider>
        <Layout className="p-6">
          <Content className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 