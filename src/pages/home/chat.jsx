import React, { useState } from 'react';
import { Menu, Avatar, List, Input } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import './chat.scss';

const users = {
  staff: [
    { id: 1, name: 'Đỗ Hữu Thuận' },
    { id: 2, name: 'Đỗ Hữu Thuận 1' },
    { id: 3, name: 'Đỗ Hữu Thuận 2' },
    { id: 4, name: 'Đỗ Hữu Thuận 3' },
    { id: 5, name: 'Đỗ Hữu Thuận 4' },
  ],
  customers: [
    { id: 6, name: 'Hữu Thuận' },
    { id: 7, name: 'Hữu Thuận 1' },
    { id: 8, name: 'Hữu Thuận 2' },
    { id: 9, name: 'Hữu Thuận 3' },
    { id: 10, name: 'Hữu Thuận 4' },
  ],
};

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(users.staff[0]);
  const [menuKey, setMenuKey] = useState('staff');
  const [message, setMessage] = useState('');

  const handleMenuClick = (e) => {
    setMenuKey(e.key);
    setSelectedUser(users[e.key][0]);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar" style={{background: '#fff'}}>
        <Menu
          mode="horizontal"
          selectedKeys={[menuKey]}
          onClick={handleMenuClick}
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          <Menu.Item key="staff">Nhân Viên</Menu.Item>
          <Menu.Item key="customers">Khách Hàng</Menu.Item>
        </Menu>
        <List
          itemLayout="horizontal"
          dataSource={users[menuKey]}
          renderItem={(user) => (
            <List.Item
              onClick={() => handleUserClick(user)}
              style={{ cursor: 'pointer', padding: '10px 20px' }}
              className={user.id === selectedUser.id ? 'selected-user' : ''}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={user.name}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <Avatar icon={<UserOutlined />} style={{ marginRight: '10px' }} />
          {selectedUser.name}
        </div>
        <div className="chat-content">
          <div className="chat-window">
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
            <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">Tôi muốn nghỉ việc</div>
            </div>
            <div className="message right">
              <div className="message-content">Tôi muốn nghỉ việc</div>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </div>
        <div className="chat-input">
          <Input
            placeholder="Gửi tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ borderRadius: '20px'}}
            suffix={
              <SendOutlined
                onClick={handleSendMessage}
                style={{ cursor: 'pointer', color: '#1890ff' }}
              />
            }
            onPressEnter={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
