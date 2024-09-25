import React from 'react';
import { Form, Input, Button } from 'antd';
import { Navigate, useNavigate } from "react-router-dom";
import './Auth.scss';

const App = () => {
  const navigate = useNavigate()
  const handleSubmit = ({username, password}) => {
    if(username == 'admin' && password=='123456'){
      localStorage.setItem('authUser',JSON.stringify({
        username: 'uyen',
        role: 'admin',
        isLogged: true
      }))
      return navigate('/')

    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ĐĂNG NHẬP</h2>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Nhập địa chỉ email' }]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <a href="/" className="forgot-password">QUÊN MẬT KHẨU?</a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <span>Không có tài khoản ? <a href="/" className="register-account">Tạo ngay</a></span>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;