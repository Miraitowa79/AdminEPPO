import './dashboard.scss';
import React from 'react';

import { Menu, Card, Row, Col, Typography, List, Avatar } from 'antd';
import { UserOutlined, DashboardOutlined, BarChartOutlined, FileOutlined } from '@ant-design/icons';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { BarElement } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale);
ChartJS.register(BarElement);

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

const dataPie = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
      hoverOffset: 4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Tháng',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Doanh số (Triệu VND)',
      },
    },
  },
};


const chartData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3','Tháng 4','Tháng 5','Tháng 6', 'Tháng 7','Tháng 8','Tháng 9','Tháng 10', 'Tháng 11','Tháng 12'],
  datasets: [
    {
      label: 'Doanh số (Triệu VND)',
      data: [450, 150, 80, 40, 230, 150, 300, 240, 400, 200, 350, 200],
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      tension: 0.4, // Làm mềm đường
    },
  ],
};





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
              <Bar data={chartData} options={chartOptions} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Nguồn doanh thu">
              {/* Chèn biểu đồ nguồn doanh thu của bạn ở đây */}
              <Pie data={dataPie} />
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
