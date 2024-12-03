import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { login } from '@src/api/login';
import { getAuthUser } from '@utils';

import './Auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async ({ usernameOrEmail, password }) => {
    setLoading(true);
    try {
      const res = await login({ usernameOrEmail, password });
      localStorage.setItem('authUser', JSON.stringify(res));
      localStorage.setItem('authToken', res.token);
      navigate('/');
    } catch (error) {
      notification.error({
        duration: 5,
        message: 'Có lỗi xảy ra',
        description: 'Email/Tên đăng nhập hoặc mật khẩu không đúng!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName, event) => {
    const value = event.target.value.replace(/\s/g, ''); // Remove all whitespace
    form.setFieldsValue({ [fieldName]: value });
  };

  const validateNoWhitespace = (_, value) => {
    if (/\s/.test(value)) {
      return Promise.reject(new Error('Không được chứa khoảng trống'));
    }
    return Promise.resolve();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ĐĂNG NHẬP</h2>
        <Form
          form={form}
          name="login_form"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Email hoặc Tên đăng nhập"
            name="usernameOrEmail"
            rules={[
              { required: true, message: 'Nhập email hoặc tên đăng nhập' },
              { validator: validateNoWhitespace },
            ]}
          >
            <Input
              placeholder="Nhập email hoặc tên đăng nhập"
              onChange={(e) => handleInputChange('usernameOrEmail', e)}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Nhập mật khẩu' },
              { validator: validateNoWhitespace },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              onChange={(e) => handleInputChange('password', e)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
