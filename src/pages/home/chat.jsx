import React, { useState, useEffect } from 'react';
import { Menu, Avatar, List, Input } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import './chat.scss';
import {getConversationsByUserId, sendMessageByConversationId} from '@src/api';
import {getAuthUser} from '@src/utils'

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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [menuKey, setMenuKey] = useState('staff');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([])

  const handleMenuClick = (e) => {
    setMenuKey(e.key);
  };

  const handleUserClick = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage =async () => {
    if (message.trim()) {
      try {
        await sendMessageByConversationId({
          conversationId: selectedConversation,
          userId: getAuthUser().userId,
          message1: message.trim(),
          type:'text'
        })
        setMessage('')
        handleGetConversations()
      } catch (error) {
        console.log('err', error)
      }
    }
  };
 
  const handleGetConversations =async () => {
    try {
      const res = await getConversationsByUserId(1);
      setConversations(res)
    } catch (error) {
      console.log('err', error)
    }
  }


  useEffect(() => {
    handleGetConversations()
  }, [])

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
          dataSource={conversations}
          renderItem={(conversation) => (
            <List.Item
              onClick={() => handleUserClick(conversation?.conversationId)}
              style={{ cursor: 'pointer', padding: '10px 20px' }}
              className={conversation.conversationId === selectedConversation ? 'selected-user' : ''}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={'Uyen Tran'}
              />
            </List.Item>
          )}
        />
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <Avatar icon={<UserOutlined />} style={{ marginRight: '10px' }} />
          {selectedConversation}
        </div>
        <div className="chat-content">
          <div className="chat-window">
            {conversations.find(val => {
              return val.conversationId === selectedConversation
            })?.messages?.map((message) => {
                console.log(message?.message1)
              if(message?.userId === getAuthUser()?.userId){
                return (
                  <div className="message right">
                  <div className="message-content">{message?.message1}</div>
                    <Avatar icon={<UserOutlined />} />
                </div>
                )
              }else{
                return (
                  <div className="message left">
              <Avatar icon={<UserOutlined />} />
              <div className="message-content">{message?.message1}</div>
            </div>
                )
              }
            }).reverse()}
           
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
