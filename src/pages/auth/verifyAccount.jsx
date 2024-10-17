import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import './Auth.scss';

const Verify = () => {
//   const navigate = useNavigate();
  
//   const handleSubmit = ({ phone, otp }) => {
//     if (phone === '0333888257' && otp === '123456') {
//       localStorage.setItem('authUser', JSON.stringify({
//         username: 'uyen',
//         role: 'admin',
//         isLogged: true,
//         userId: 1
//       }));
//       return navigate('/');
//     }
//   };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Xác thực tài khoản</h2>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          layout="vertical"
        //   onFinish={handleSubmit}
        >
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Nhập số điện thoại' }]}
          >
            <Input placeholder="0333888257" />
          </Form.Item>

          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: 'Nhập OTP' }]}
          >
            <Input.Password placeholder="******" />
          </Form.Item>

          <Form.Item>
            <span className="resend-code">Gửi lại mã: <span className="timer">1:30</span></span>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Xác thực
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Verify;
