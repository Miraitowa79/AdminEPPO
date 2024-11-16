import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Typography, Card, Spin, message, Avatar } from 'antd';
import { getAccountDetails } from '../../../api/accountManagement';
import { getWalletDetail } from '../../../api/walletAPI';
import avatar from "../../../assets/images/team-2.jpg";
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const AccountDetails = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchAccountDetails = async (id) => {
      try {
        const {data} = await getAccountDetails(id);
        setData(data);
        console.log('data: ', data)
      } catch (error) {
        console.error('Error fetching account details:', error);
        message.error('Error fetching account details');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAccountDetails(userId);
      console.log('userid: ', userId)
    }
  }, [userId]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT TÀI KHOẢN</Title>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button type="primary" shape="round">Mã ID: {data.userId}</Button>
        </div>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left">
          <Form.Item label="Hình ảnh">
            <Avatar style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%' }} src={avatar}/>
          </Form.Item>
          <Form.Item label="Tên tài khoản:">
            <Input value={data.userName || ''} readOnly />
          </Form.Item>
          <Form.Item label="Họ và tên:">
            <Input value={data.fullName || ''} readOnly />
          </Form.Item>
          <Form.Item label="Giới tính">
            <Select value={data.gender || 'Nam'} disabled>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <DatePicker value={data.dateOfBirth ? moment(data.dateOfBirth) : null} style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input value={data.phoneNumber || ''} readOnly />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={data.email || ''} readOnly />
          </Form.Item>
          <Form.Item label="CCCD">
            <Input value={data.identificationCard || ''} readOnly />
          </Form.Item>
          <Form.Item label="Số dư ví (VND)">
            <Input value={data.walletId || ''} readOnly />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="default" danger style={{ marginRight: '10px' }}>Hủy</Button>
            <Button type="primary">Cập nhật</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AccountDetails;
