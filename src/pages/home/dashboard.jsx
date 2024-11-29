import './dashboard.scss';
import React, { useState, useEffect } from 'react';
import { Menu, Card, Row, Col, Typography, List, Avatar } from 'antd';
import { UserOutlined, DashboardOutlined, BarChartOutlined, FileOutlined } from '@ant-design/icons';
import { Bar, Pie } from 'react-chartjs-2';
import { BarElement } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, BarElement);

const { Title, Text } = Typography;

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: 'Doanh số (Triệu VND)',
        data: Array(12).fill(0), // Khởi tạo dữ liệu mặc định là 0
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const [revenuePieData, setRevenuePieData] = useState({
    labels: ['Đấu giá', 'Bán', 'Cho thuê'],
    datasets: [
      {
        label: 'Nguồn doanh thu',
        data: [0, 0, 0], // Mẫu dữ liệu mặc định
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4,
      },
    ],
  });

  const [customerList, setCustomerList] = useState([
    { title: 'Jenny Wilson', description: '12,340,000 VND' },
    { title: 'Devon Lane', description: '12,340,000 VND' },
    { title: 'Jane Cooper', description: '12,340,000 VND' },
    { title: 'Dianne Russell', description: '12,340,000 VND' },
  ]);

  const fetchRevenueDataBar = async () => {
    try {
      const response = await axios.get('https://sep490ne-001-site1.atempurl.com/api/v1/Count/Order/Revenue/Month', {
        params: { status: 4, year: 2024 },
      });      
      if (response.data?.data) {
        const revenueData = response.data.data.map((value) => value / 1_000_000); // Chuyển từ đồng sang triệu VND
        setChartData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: revenueData,
            },
          ],
        }));
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } 
  };
  const fetchRevenueDataPie = async () => {
    try {
      const response = await axios.get('https://sep490ne-001-site1.atempurl.com/api/v1/Count/Order/Revenue/TypeEcommerceId', {
        params: { status: 4, year: 2024 },
      });

      if (response.data?.data) {
        // Dữ liệu từ API (Dữ liệu phần trăm cho các loại doanh thu)
        const { auction, sell, rent } = response.data.data.percentages;

        // Cập nhật dữ liệu cho biểu đồ tròn (Pie chart)
        setRevenuePieData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [auction, sell, rent], // Cập nhật tỷ lệ phần trăm cho từng loại
            },
          ],
        }));
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };
  const fetchCustomerCount = async () => {
    try {
      const response = await fetch('https://localhost:7202/api/v1/Count/Customer/Status');
      if (response.ok) {
        const data = await response.json();
        setCustomerCount(data.count); // Giả sử API trả về số lượng trong trường `count`
      } else {
        console.error('Failed to fetch customer count');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueDataBar();
    fetchRevenueDataPie();
    fetchCustomerCount();
  }, []);

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

  return (
    <div className="dashboard">
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
              <Bar data={chartData} options={chartOptions} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Nguồn doanh thu">
              <Pie data={revenuePieData} />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '16px' }}>
          <Col span={16}>
            <Card title="Top sản phẩm">
              {/* Có thể chèn thêm danh sách sản phẩm */}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Khách hàng thân thiết">
              <List
                itemLayout="horizontal"
                dataSource={customerList}
                renderItem={(item) => (
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
};

export default Dashboard;
