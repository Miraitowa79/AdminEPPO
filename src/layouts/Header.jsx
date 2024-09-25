import { useState, useEffect } from "react";
import logo from "../assets/images/logo/Vector.png";
import {
  Row,
  Col,
  Button,
  Avatar,
  Badge,
} from "antd";
import {
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import avatar from "../assets/images/team-2.jpg";

const ButtonContainer = styled.div`
  .ant-btn-link {
    color: #5457FB;
  }
`;

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");

  useEffect(() => window.scrollTo(0, 0));

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      <Row gutter={[24, 0]} style={{ padding: '10px 20px' }}>
        <Col span={12} md={6}>
          <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="" style={{ marginRight: 10 }} />
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
            <Button type="link">
              <Badge count={3}>
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Button>
            <Link to="/profile">
              <Avatar src={avatar} size="large" />
            </Link>
          </ButtonContainer>
        </Col>
      </Row>
    </>
  );
}

export default Header;
