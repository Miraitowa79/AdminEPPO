import { useState, useEffect } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, UserOutlined, BellOutlined, FileTextOutlined, FolderOpenOutlined, CommentOutlined, StarOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import "./SideNav.scss";
import {getAuthUser} from '@utils'

const { SubMenu } = Menu;

function SideNav({ color }) {
    const user = getAuthUser();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const page = pathname.replace("/", "");

    const [role, setRole] = useState("");
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([pathname]);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);

        const pathParts = pathname.split('/');
        if (pathParts.length > 2) {
            setOpenKeys([`submenu-${pathParts[2]}`]);
        }
    }, []);

    const sideBarOption = {
        1: [
            {
                path: '/list/users',
                name: 'Tài khoản',
                styleIcon: {
                    background: page === "account" ? color : "",
                },
                icon: <UserOutlined />
            },
            // {
            //     path:'/staff/contract',
            //     name:'Hợp đồng',
            //     icon:  <FileTextOutlined />
            // },
        ],
        2:[
            {
                path: '/list/users',
                name: 'Tài khoản',
                styleIcon: {
                    background: page === "account" ? color : "",
                },
                icon: <UserOutlined />
            },
            {
                path:'/management/contract',
                name:'Hợp đồng',
                icon:  <FileTextOutlined />
            },
            {
                name:'Sản phẩm',
                icon:  <FolderOpenOutlined />,
                submenu: [
                    { path: '/manager/products/plants', name: 'Cây cảnh' },
                    { path: '/manager/products/tools', name: 'Dụng cụ' },
                ]
            },
            {
                path:'/manager/auction',
                name: 'Đấu giá',
                icon: <FolderOpenOutlined />
            },
            {
                path:'/management/chat',
                name: 'Chat',
                icon: <MessageOutlined />
            },
            {
                path:'/management/feedback',
                name: 'Đánh giá',
                icon: <CommentOutlined />
            },
        ],
        3:[
            {
                path:'/management/contract',
                name:'Hợp đồng',
                icon:  <FileTextOutlined />
            },
            {
                path:'/staff/orders',
                name: 'Đơn hàng',
                icon: <FileTextOutlined />
            },
            {
                path:'/staff/auction',
                name: 'Đấu giá',
                icon: <FolderOpenOutlined />
            },
            {
                path:'/management/chat',
                name: 'Chat',
                icon: <MessageOutlined />
            },
            {
                path:'/management/feedback',
                name: 'Đánh giá',
                icon: <CommentOutlined />
            }
        ]
    }

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

    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    return (
        <>
            <div className="role-display">
                <Button type="primary" block style={{ background: '#5457FB' , fontSize: '15px' }}>
                    {user?.roleName === 'admin' && 'QUẢN TRỊ VIÊN'}
                    {user?.roleName === 'manager' && 'QUẢN LÍ'}
                    {user?.roleName === 'staff' && 'NHÂN VIÊN'}
                </Button>
            </div>
            <Menu
                theme="light"
                mode="inline"
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                onOpenChange={handleOpenChange}
                onClick={({ key }) => setSelectedKeys([key])}
            >
               {user?.roleId == 2 && (
                <Menu.Item key="/dashboard">
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
               )}
                <Menu.Item className="menu-item-header">
                    QUẢN LÍ
                </Menu.Item>
                {sideBarOption[user?.roleId]?.map((option, index) => {
                    if (option.submenu) {
                        return (
                            <SubMenu
                                // key={`submenu-${index}`}
                                key={option.path}
                                title={
                                    <span>
                                        <span className="icon" style={option?.styleIcon || {}}>
                                            {option.icon}
                                        </span>
                                        <span className="label">{option.name}</span>
                                    </span>
                                }
                            >
                                {option.submenu.map((subOption, subIndex) => (
                                    <Menu.Item key={subOption.path}>
                                        <NavLink to={subOption.path} style={{ justifyContent: 'center'}}>
                                            <span className="label">{subOption.name}</span>
                                        </NavLink>
                                    </Menu.Item>
                                ))}
                            </SubMenu>
                        );
                    }
                    return (
                        <Menu.Item key={option.path}>
                    <NavLink to={option.path}>
                        <span
                            className="icon"
                            style={option?.styleIcon || {}}
                        >
                            {option.icon}
                        </span>
                        <span className="label">{option.name}</span>
                    </NavLink>
                </Menu.Item>
                    )
                })}
               
               
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
