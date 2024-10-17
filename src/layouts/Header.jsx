import React, { useState, useEffect } from "react";
import { Row, Col, Button, Avatar, Badge, Dropdown, Menu } from "antd";
import {useNavigate} from 'react-router-dom'
import { BellOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/images/logo/Vector.png";
import avatar from "../assets/images/team-2.jpg";

const ButtonContainer = styled.div`
  .ant-btn-link {
    color: #5457FB;
  }
`;

const notifications = [
  { title: "Notification 1", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 2", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 3", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 4", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 5", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 4", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
  { title: "Notification 5", message: "Có 5 hợp đồng thuê xe đang chờ duyệt" },
];

const menu = (
  <Menu>
    {notifications.map((notification, index) => (
      <Menu.Item key={index}>
        <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          <strong>{notification.title}</strong>
          <div>{notification.message}</div>
        </div>
      </Menu.Item>
    ))}
  </Menu>
);

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const navigation = useNavigate()
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");

  useEffect(() => window.scrollTo(0, 0), []);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <Row gutter={[24, 0]} style={{ padding: '10px 20px' }}>
      <Col span={12} md={6}>
        <div onClick={() => {
          navigation('/')
        }} className="brand hover-point" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo}  alt="Logo" style={{ marginRight: 10 }} />
          <span style={{ fontSize: 18, color: '#5457FB' }}>EPPO</span>
        </div>
      </Col>
      <Col span={12} md={18} style={{ textAlign: 'right' }}>
        <ButtonContainer>
          <Button type="link">
            <Badge count={5}>
              <MailOutlined style={{ fontSize: '20px' }} />
            </Badge>
          </Button>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link">
              <Badge >
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Button>
          </Dropdown>
          <Link to="/profile">
            <Avatar src={avatar} size="large" />
          </Link>
        </ButtonContainer>
      </Col>
    </Row>
  );
}

export default Header;
