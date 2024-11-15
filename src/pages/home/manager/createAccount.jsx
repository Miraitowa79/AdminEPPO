import React from 'react';
import { Form, Input, Button, Select, DatePicker, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const CreateAccount = () => {
  const navigate = useNavigate();

  const handleFinish = (values) => {
    // Implement account creation logic here
    console.log('Account created:', values);
    navigate('/list/users'); // Redirect to account list page after creation
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>TẠO TÀI KHOẢN MỚI</Title>
      <Card>
        <Form
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          onFinish={handleFinish}
        >
          <Form.Item label="Tên tài khoản:" name="userName" rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Họ và tên:" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender" initialValue="Nam">
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="CCCD" name="identificationCard">
            <Input />
          </Form.Item>
          <Form.Item label="Số dư ví (VND)" name="walletId">
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="default" danger style={{ marginRight: '10px' }} onClick={() => navigate('/list/users')}>Hủy</Button>
            <Button type="primary" htmlType="submit">Tạo</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAccount;
