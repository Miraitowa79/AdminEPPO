import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./SideNav";
import Header from "./Header";
import Footer from "./Footer";

const { Header: AntHeader, Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(true); // Set fixed to true by default

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
      style={{ minHeight: "100vh" }}
    >
      <Affix offsetTop={0}>
        <AntHeader
          className={`${fixed ? "ant-header-fixed" : ""}`}
          style={{
            background: "#fff",
            padding: "0 16px",
            boxShadow: "none",
            margin: 0
          }}
        >
          <Header
            onPress={openDrawer}
            name={pathname}
            subName={pathname}
            handleSidenavColor={handleSidenavColor}
            handleSidenavType={handleSidenavType}
            handleFixedNavbar={handleFixedNavbar}
          />
        </AntHeader>
      </Affix>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          trigger={null}
          width={250}
          theme="light"
          className={`sider-primary ant-layout-sider-primary ${
            sidenavType === "#fff" ? "active-route" : ""
          }`}
          style={{
            background: sidenavType,
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            top: 64,
            left: 0,
            margin: "0px 20px"
          }}
        >
          <Sidenav color={sidenavColor} />
        </Sider>
        <Layout style={{ background: "#f0f2f5", marginLeft:0 }}>
          <Content
            className="content-ant"
            style={{
              margin: "20px",
              padding: "24px",
              minHeight: "calc(100vh - 64px)",
              background: "none",
            }}
          >
            <Outlet />
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Main;
