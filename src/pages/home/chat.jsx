import React, { useState, useEffect } from 'react';
import { Menu, Avatar, List, Input } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import './chat.scss';
import {getConversations, sendMessageByConversationId} from '@src/api';
import {getAuthUser} from '@src/utils'
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
  const [socketUrl, setSocketUrl] = useState(import.meta.env.VITE_SOCKET_URL);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,  {
    onOpen: (e) => console.log('Connected to WebSocket',e),
    onClose: (e) => console.log('Disconnected from WebSocket',e),
    onError: (event) => console.error('WebSocket error', event),
    shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events, such as server shutting down
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('check last message', lastMessage)
      handleGetConversations()
    }
  }, [lastMessage]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [menuKey, setMenuKey] = useState('staff');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([])

  const handleMenuClick = (e) => {
    setMenuKey(e.key);
  };

  const handleUserClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage =async () => {
    console.log(
      'here'
    )
    if (message.trim()) {
      try {
        await sendMessageByConversationId({
          conversationId: selectedConversation.conversationId,
          message1: message.trim(),
          userId: getAuthUser().userId,
          type:'text'
        })
        sendMessage(JSON.stringify({"Token": localStorage.getItem('authToken')}), true)
        // console.log('c', {Token: localStorage.getItem('authToken')})
        sendMessage(
          JSON.stringify({
            "ConversationId": selectedConversation.conversationId,
            "Message1": message.trim(),
            "Type": "text",
            "ImageLink": null
        }), true
        )
        setMessage('')
        handleGetConversations()
      } catch (error) {
        console.log('err', error)
      }
    }
  };
 
  const handleGetConversations =async () => {
    try {
      const res = await getConversations();
      setConversations(res)
    } catch (error) {
      console.log('err', error)
    }
  }


  useEffect(() => {
    handleGetConversations()
  }, [])

  console.log(
    'check conversations', conversations
  )

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
              onClick={() => handleUserClick(conversation)}
              style={{ cursor: 'pointer', padding: '10px 20px' }}
              className={conversation.conversationId === selectedConversation?.conversationId ? 'selected-user' : ''}
            >
            {conversation?.userTwoNavigation.userId == getAuthUser().userId ? (
              <List.Item.Meta
                avatar={conversation?.userOneNavigation.imageUrl ?<Avatar src={conversation?.userOneNavigation.imageUrl}/> :<Avatar icon={<UserOutlined />} />}
                title={conversation?.userOneNavigation.fullName}
              />
             
            ): (
              <List.Item.Meta
                avatar={conversation?.userTwoNavigation.imageUrl ?<Avatar src={conversation?.userTwoNavigation.imageUrl}/> :<Avatar icon={<UserOutlined />} />}
                title={conversation?.userTwoNavigation.fullName}
              />
            )}
            
            </List.Item>
          )}
        />
      </div>
      <div className="chat-main">
        <div className="chat-header">
        {selectedConversation?.userTwoNavigation.userId == getAuthUser().userId ? (
          <>

          {selectedConversation?.userOneNavigation.imageUrl ?<Avatar src={selectedConversation?.userOneNavigation.imageUrl} style={{ marginRight: '10px' }} /> :<Avatar icon={<UserOutlined />} style={{ marginRight: '10px' }} />}
          
          {selectedConversation?.userOneNavigation?.fullName}
          </>
        ): (
          <>

          {selectedConversation?.userTwoNavigation.imageUrl ?<Avatar src={selectedConversation?.userTwoNavigation.imageUrl} style={{ marginRight: '10px' }} /> :<Avatar icon={<UserOutlined />} style={{ marginRight: '10px' }} />}
          
          {selectedConversation?.userTwoNavigation?.fullName}
          </>
        )}
        
        </div>
        <div className="chat-content">
          <div className="chat-window">
            {conversations?.find(val => {
              return val.conversationId === selectedConversation?.conversationId
            })?.messages?.map((message) => {
           
              if(message?.userId == getAuthUser()?.userId){
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
            })}
           
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
