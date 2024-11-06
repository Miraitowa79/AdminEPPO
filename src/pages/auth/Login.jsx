import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Navigate, useNavigate } from "react-router-dom";
import { login } from '@src/api/login'
import {getAuthUser} from '@utils'

import './Auth.scss';

const Login = () => {
  const navigate = useNavigate()
  
  const handleSubmit =async ({usernameOrEmail, password}) => {
    try {
      const res = await login({usernameOrEmail, password});
      localStorage.setItem('authUser',JSON.stringify(res));
      localStorage.setItem('authToken', res.token);
      return navigate('/')
    } catch (error) {
      notification.error({
        duration: 5,
        message: 'Có lỗi xảy ra',
        description: 'Email/Tên đăng nhập hoặc mật khẩu không đúng!'
      })
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
            label="Email hoặc Tên đăng nhập"
            name="usernameOrEmail"
            rules={[{ required: true, message: 'Nhập email hoặc tên đăng nhập' }]}
          >
            <Input placeholder="Nhập email hoặc tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          {/* <Form.Item>
            <a href="/" className="forgot-password">QUÊN MẬT KHẨU?</a>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>

          {/* <Form.Item>
            <span>Không có tài khoản ? <a href="/" className="register-account">Tạo ngay</a></span>
          </Form.Item> */}
        </Form>
      </div>
    </div>
  );
};

export default Login;