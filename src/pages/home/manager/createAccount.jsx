import React from 'react';
import { Form, Input, Button, Select, DatePicker, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const CreateAccount = () => {
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    // Chuyển đổi dữ liệu phù hợp với API
    const payload = {
      userName: values.userName,
      password: values.password,
      fullName: values.fullName,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
      phoneNumber: values.phoneNumber,
      email: values.email,
      addressDescription: values.addressDescription,
      identificationCard: values.identificationCard,
    };

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post(
        'https://sep490ne-001-site1.atempurl.com/api/v1/Owner/CreateAccount/Owner',
        payload
      );
      message.success('Tài khoản được tạo thành công!');
      navigate('/list/users'); // Chuyển hướng sau khi tạo thành công
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.');
    }
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
          <Form.Item
            label="Tên tài khoản:"
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ và tên:"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender" initialValue="Nam">
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Mật khẩu:"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="CCCD/CMND" name="identificationCard">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="addressDescription">
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="default"
              danger
              style={{ marginRight: '10px' }}
              onClick={() => navigate('/list/users')}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAccount;
