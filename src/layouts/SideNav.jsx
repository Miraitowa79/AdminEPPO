import { useState, useEffect } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, UserOutlined, BellOutlined, FileTextOutlined, FolderOpenOutlined, CommentOutlined, StarOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import "./SideNav.scss";

const { SubMenu } = Menu;

function SideNav({ color }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const page = pathname.replace("/", "");

    const [role, setRole] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
    }, []);

    const dashboard = [
        <HomeOutlined />
    ];

    const account = [
        <UserOutlined />
    ];

    const auction = [
        <FolderOpenOutlined />
    ];

    const contract = [
        <FileTextOutlined />
    ];

    const product = [
        <FolderOpenOutlined />
    ];

    const order = [
        <BellOutlined />
    ];

    const blog = [
        <FileTextOutlined />
    ];

    const feedback = [
        <StarOutlined />
    ];

    const chat = [
        <MessageOutlined />
    ];

    const logout = [
        <LogoutOutlined />
    ];

    return (
        <>
            <div className="role-display">
                <Button type="primary" block style={{ background: '#5457FB' }}>
                    {role}
                </Button>
            </div>
            <Menu theme="light" mode="inline">
                <Menu.Item key="1">
                    <NavLink to="/dashboard">
                        <span
                            className="icon"
                            style={{
                                background: page === "dashboard" ? color : "",
                            }}
                        >
                            {dashboard}
                        </span>
                        <span className="label">Dashboard</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item className="menu-item-header">
                    QUẢN LÍ
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to="/account">
                        <span
                            className="icon"
                            style={{
                                background: page === "account" ? color : "",
                            }}
                        >
                            {account}
                        </span>
                        <span className="label">Tài khoản</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to="/auction">
                        <span className="icon">{auction}</span>
                        <span className="label">Đấu giá</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                    <NavLink to="/contract">
                        <span className="icon">{contract}</span>
                        <span className="label">Hợp đồng</span>
                    </NavLink>
                </Menu.Item>
                <SubMenu
                    key="product"
                    title={
                        <span>
                            <span
                                className="icon"
                                style={{
                                    background: page === "product" ? color : "",
                                }}
                            >
                                {product}
                            </span>
                            <span className="label">Sản phẩm</span>
                        </span>
                    }
                >
                    <Menu.Item key="5-1">
                        <NavLink to="/product/plants">
                            <span className="label">Cây cảnh</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="5-2">
                        <NavLink to="/product/tools">
                            <span className="label">Dụng cụ</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="5-3">
                        <NavLink to="/product/services">
                            <span className="label">Dịch vụ</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="6">
                    <NavLink to="/order">
                        <span className="icon">{order}</span>
                        <span className="label">Đơn hàng</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                    <NavLink to="/blog">
                        <span className="icon">{blog}</span>
                        <span className="label">Bài viết</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="8">
                    <NavLink to="/feedback">
                        <span
                            className="icon"
                            style={{
                                background: page === "feedback" ? color : "",
                            }}
                        >
                            {feedback}
                        </span>
                        <span className="label">Đánh giá</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="9">
                    <NavLink to="/chat/support">
                        <span className="icon">{chat}</span>
                        <span className="label">Chat</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
            <div className="aside-footer">
                <Button className="ant-btn-sm ant-btn-block" onClick={() => {
                    localStorage.clear('authUser');
                    return navigate('/auth/login');
                }}>
                    {logout}
                    Đăng xuất
                </Button>
            </div>
        </>
    );
}

export default SideNav;
