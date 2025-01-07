import "./dashboard.scss";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Card,
  Row,
  Col,
  Typography,
  List,
  Avatar,
  Rate,
  Select,
} from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  BarChartOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Bar, Pie } from "react-chartjs-2";
import { BarElement } from "chart.js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true); // Loading state to indicate data fetching
  const [customerCount, setCustomerCount] = useState(0); // Initialize customer count state
  const [orderCount, setOrderCount] = useState(0);
  const [orderRevenue, setOrderRevenue] = useState(0);
  const [orderRevenueToday, setOrderRevenueToday] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh số (Triệu VND)",
        data: Array(12).fill(0), // Khởi tạo dữ liệu mặc định là 0
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  const [revenuePieData, setRevenuePieData] = useState({
    labels: ["Đấu giá", "Bán", "Cho thuê"],
    datasets: [
      {
        label: "Nguồn doanh thu",
        data: [0, 0, 0], // Mẫu dữ liệu mặc định
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  });

  const fetchRevenueDataBar = async (year) => {
    try {
      const response = await axios.get(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Order/Revenue/Month",
        {
          params: { status: 4, year: year },
        }
      );
      if (response.data?.data) {
        const revenueData = response.data.data.map(
          (value) => value / 1_000_000
        ); // Chuyển từ đồng sang triệu VND
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
      console.error("Error fetching revenue data:", error);
    }
  };
  const fetchRevenueDataPie = async () => {
    try {
      const response = await axios.get(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Order/Revenue/TypeEcommerceId",
        {
          params: { status: 4, year: 2024 },
        }
      );

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
      console.error("Error fetching revenue data:", error);
    }
  };
  const fetchCustomerCount = async () => {
    try {
      const response = await fetch(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Customer/Status"
      );
      if (response.ok) {
        const data = await response.json();
        setCustomerCount(data.data); // Use the 'data' field which contains the count of customers
      } else {
        console.error("Failed to fetch customer count");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Order/Status"
      );
      if (response.ok) {
        const data = await response.json();
        setOrderCount(data.data); // Use the 'data' field which contains the count of customers
      } else {
        console.error("Failed to fetch order count");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  const fetchOrdersRevenue = async () => {
    try {
      const response = await fetch(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Order/Total/Revenue"
      );
      if (response.ok) {
        const data = await response.json();
        setOrderRevenue(data.data); // Use the 'data' field which contains the count of customers
      } else {
        console.error("Failed to fetch order count");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  const fetchOrdersRevenueToday = async () => {
    try {
      const response = await fetch(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/Count/Order/Today/Revenue"
      );
      if (response.ok) {
        const data = await response.json();
        setOrderRevenueToday(data.data); // Use the 'data' field which contains the count of customers
      } else {
        console.error("Failed to fetch order count");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  const fetchCustomerList = async () => {
    try {
      const response = await axios.get(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/GetUser/Users/TopCustomers?page=1&size=5"
      ); // Replace with your API URL
      if (response.data?.data) {
        setCustomerList(response.data.data); // Update state with the fetched data
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const fetchFeedbackList = async () => {
    try {
      const response = await axios.get(
        "https://sep490pass-001-site1.ptempurl.com/api/v1/GetList/Feedback/Order/Delivered/Plant/Renting?page=1&size=5"
      );
      if (response.data?.data) {
        setFeedbackList(response.data.data); // Update state with the fetched data
        console.log("Feedback list:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Dùng Promise.allSettled để đảm bảo tất cả hàm được gọi
        const results = await Promise.allSettled([
          await fetchRevenueDataBar(),
          await fetchRevenueDataPie(),
          await fetchCustomerCount(),
          await fetchOrders(),
          await fetchOrdersRevenue(),
          await fetchOrdersRevenueToday(),
          await fetchCustomerList(),
          await fetchFeedbackList(),
        ]);

        // Kiểm tra kết quả từng promise
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`Fetch function ${index} failed:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
        },
      },
      y: {
        title: {
          display: true,
          text: "Doanh số (Triệu VND)",
        },
      },
    },
  };
  const generateYears = (startYear) => {
    const currentYear = new Date().getFullYear() + 11;
    let years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const years = generateYears(2000);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };
  useEffect(() => {
    fetchRevenueDataBar(selectedYear);
  }, [selectedYear]);
  return (
    <div className="dashboard">
      <div className="content">
        <Row gutter={16} style={{ margin: "16px 0" }}>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng doanh số hôm nay</Title>
              <Text style={{ textAlign: "right", display: "block" }}>
                {orderRevenueToday.toLocaleString("en-US")} VND
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng doanh số</Title>
              <Text style={{ textAlign: "right", display: "block" }}>
                {orderRevenue.toLocaleString("en-US")} VND
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng các đơn hàng</Title>
              <Text style={{ textAlign: "right", display: "block" }}>
                {orderCount}
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Title level={4}>Tổng khách hàng</Title>
              <Text style={{ textAlign: "right", display: "block" }}>
                {customerCount}
              </Text>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Card>
              <Row justify="space-between" align="middle">
                {/* Tiêu đề */}
                <Col>
                  <h3>Báo cáo bán hàng</h3>
                </Col>
                {/* Select nằm ngang với tiêu đề */}
                <Col>
                  <Select
                    value={selectedYear}
                    style={{ width: 120 }}
                    onChange={handleYearChange}
                  >
                    {years.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Bar data={chartData} options={chartOptions} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Nguồn doanh thu">
              <Pie data={revenuePieData} />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "16px" }}>
          <Col span={16}>
            <Card title="Top sản phẩm đánh giá">
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {" "}
                {/* Thêm style để cho phép cuộn dọc */}
                <List
                  dataSource={feedbackList}
                  renderItem={(item) => (
                    <List.Item key={item.plantId}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Hiển thị hình ảnh chính của cây */}
                        <Avatar
                          src={item.mainImage}
                          size={64}
                          style={{ marginRight: "16px" }}
                        />

                        <div style={{ flex: 1 }}>
                          {/* Hiển thị tên cây */}
                          <Title level={4}>
                            {item.plantName}{" "}
                            <Text strong>({item.ownerName})</Text>{" "}
                          </Title>

                          {/* Hiển thị xếp hạng */}
                          <div style={{ marginTop: "8px" }}>
                            <Rate disabled value={item.totalRating} />
                            <Text style={{ marginLeft: "8px" }}>
                              ({item.totalRating})
                            </Text>{" "}
                            <Text>/{item.totalFeedbacks} Feedbacks</Text>
                          </div>

                          {/* Hiển thị mô tả cây */}
                          <Text>{item.description}</Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Khách hàng thân thiết">
              <List
                itemLayout="horizontal"
                dataSource={customerList}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        item.imageUrl ? (
                          <Avatar src={item.imageUrl} />
                        ) : (
                          <Avatar icon={<UserOutlined />} />
                        )
                      }
                      title={
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{item.fullName}</span>
                          {/* Hiển thị xếp hạng bên cạnh */}
                          {index === 0 && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: "gold",
                                fontWeight: "bold",
                              }}
                            >
                              1st
                            </span>
                          )}
                          {index === 1 && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: "silver",
                                fontWeight: "bold",
                              }}
                            >
                              2nd
                            </span>
                          )}
                          {index === 2 && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: "#cd7f32",
                                fontWeight: "bold",
                              }}
                            >
                              3rd
                            </span>
                          )}
                        </div>
                      }
                      description={item.wallet.numberBalance}
                      VND
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
