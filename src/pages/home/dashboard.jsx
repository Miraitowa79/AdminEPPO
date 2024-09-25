import './dashboard.scss';
import React from 'react';
import { Menu, Card, Row, Col, Typography, List, Avatar } from 'antd';
import { UserOutlined, DashboardOutlined, BarChartOutlined, FileOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const data = [
  {
    title: 'Jenny Wilson',
    description: '12,340,000 VND',
  },
  {
    title: 'Devon Lane',
    description: '12,340,000 VND',
  },
  {
    title: 'Jane Cooper',
    description: '12,340,000 VND',
  },
  {
    title: 'Dianne Russell',
    description: '12,340,000 VND',
  },
];

function Dashboard() {
  return (
    <div className="dashboard">
      {/* <header className="header">
        <div className="logo" />
        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<BarChartOutlined />}>
            Reports
          </Menu.Item>
          <Menu.Item key="3" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </header> */}
      <div className="content">
        <Row gutter={16} style={{ margin: '16px 0' }}>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng doanh số hôm nay</Title>
              <Text>12,426,000</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng doanh số</Title>
              <Text>2,38,485</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng các đơn hàng</Title>
              <Text>84,382</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng khách hàng</Title>
              <Text>33,493</Text>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Card title="Báo cáo bán hàng">
              {/* Chèn biểu đồ của bạn ở đây */}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Nguồn doanh thu">
              {/* Chèn biểu đồ nguồn doanh thu của bạn ở đây */}
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '16px' }}>
          <Col span={16}>
            <Card title="Top sản phẩm">
              {/* Chèn danh sách sản phẩm của bạn ở đây */}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Khách hàng thân thiết">
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
