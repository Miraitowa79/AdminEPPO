import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Typography, Card, Spin, message, Avatar } from 'antd';

import { getAccountDetails, updateAccountDetails } from '../../../api/accountManagement';
import avatar from "../../../assets/images/team-2.jpg";
import moment from 'moment';
import './../staff/orderDetailStaff.scss';
const { Title } = Typography;
const { Option } = Select;

const AccountDetails = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
D
  const [accounts, setAccount] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchAccountDetails = async (id) => {
      try {
        const response = await getAccountDetails(id);
        setData(response.data);

        console.log('data:', response.data);


      } catch (error) {
        console.error('Error fetching account details:', error);
        message.error('Lỗi khi tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAccountDetails(userId);
    }
  }, [userId]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

<<<<<<< HEAD
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      console.log('Updated values:', values);
      message.success('Thông tin tài khoản đã được cập nhật');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating account:', error);
      message.error('Lỗi khi cập nhật tài khoản');
    }
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleFinish = async (updatedData) => {
    try {
      const updatedAccount = {
        ...accounts,
        ...updatedData,

      };
      await updateAccountDetails(id, updatedAccount);
      setAccount(updatedAccount);
      setIsEditing(false);
      message.success('Cập nhật hợp đồng thành công!');
    } catch (error) {
      message.error('Error updating contract details');
    }
  };


  // Handle account update
  const handleUpdate = async () => {
     
      
      try {
      setIsSubmitting(true);
      const values = await form.validateFields();  // Validate form
      const updatedAccount = { ...data, ...values };  // Merge old data with updated values

      // Call API to update account
      const response = await updateAccountDetails(userId, updatedAccount);
      setData(updatedAccount);  
      message.success('Thông tin tài khoản đã được cập nhật');
      setIsEditing(false);
      } catch (error) {
        message.error('Lỗi khi tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }

  };

  const handleCancelEdit = () => {
    form.resetFields();  // Reset the form
    setIsEditing(false);  // Disable editing
  };


  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Left Section */}
      <div style={{ flex: 4 }}>
        <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT TÀI KHOẢN</Title>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button type="primary" shape="round">Mã ID: {data.userId}</Button>
          </div>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"

            onFinish={handleFinish}

            onFinish={handleUpdate}  // Submit form on finish

            initialValues={data}
          >
            <Form.Item label="Hình ảnh">
              <Avatar
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '50%',
                }}
                src={avatar}
              />
            </Form.Item>
            <Form.Item label="Tên tài khoản">
              <Input value={data.userName || ''} readOnly />
            </Form.Item>
            <Form.Item label="Họ và tên">
              <Input value={data.fullName || ''} readOnly />
            </Form.Item>
            <Form.Item label="Giới tính">
              <Select value={data.gender || 'Nam'} disabled>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Ngày sinh">
              <DatePicker
                value={data.dateOfBirth ? moment(data.dateOfBirth) : null}
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input value={data.phoneNumber || ''} readOnly />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={data.email || ''} readOnly />
            </Form.Item>
            <Form.Item label="CCCD/CMND">
              <Input value={data.identificationCard || ''} readOnly />
            </Form.Item>
            <Form.Item label="Chức vụ">
              <span
                style={{
                  color: data.roleId === 1
                    ? 'blue'
                    : data.roleId === 2
                    ? 'green'
                    : data.roleId === 3
                    ? 'orange'
                    : data.roleId === 4
                    ? 'purple'
                    : 'gray',
                  fontWeight: 'bold',
                }}
              >
                {data.roleId === 1
                  ? 'Admin'
                  : data.roleId === 2
                  ? 'Quản lý'
                  : data.roleId === 3
                  ? 'Nhân viên'
                  : data.roleId === 4
                  ? 'Chủ sở hữu cây'
<<<<<<< HEAD
                  : data.roleId === 5
                  ? 'Khách hàng'
                  : 'Không xác định'}
              </span>
            </Form.Item>


          <Form.Item label="Trạng thái tài khoản">
          {isEditing ? (
            <Select value={data.status} onChange={(value) => setData({ ...data, status: value })}>
              <Option value={1}>Đang hoạt động</Option>
              <Option value={2}>Ngừng hoạt động</Option>
            </Select>
          ) : (
            <Input
              value={
                data.status === 1
                  ? 'Đang hoạt động'
                  : data.status === 2
                  ? 'Hết hạn hợp đồng'
                  : 'Bị hủy'
              }
              readOnly
            />
          )}
        </Form.Item>



            <Form.Item style={{ textAlign: 'center' }}>
            {isEditing ? (
              <>
                <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelEdit}>Hủy</Button>
                <Button type="primary" onClick={handleUpdate} style={{ marginRight: '10px' }}>
                    Lưu
                  </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)} style={{ width: '90px' }}>
              Chỉnh sửa
            </Button>
            )}
          </Form.Item>

                  : 'Không xác định'}
              </span>
            </Form.Item>
            <Form.Item label="Trạng thái tài khoản">
              {isEditing ? (
                <Select value={data.status} onChange={(value) => setData({ ...data, status: value })}>
                  <Option value={1}>Đang hoạt động</Option>
                  <Option value={2}>Ngừng hoạt động</Option>
                </Select>
              ) : (
                <Input
                  value={
                    data.status === 1
                      ? 'Đang hoạt động'
                      : data.status === 2
                      ? 'Ngừng hoạt động'
                      : 'Bị hủy'
                  }
                  readOnly
                />
              )}
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              {isEditing ? (
                <>
                  <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelEdit}>Hủy</Button>
                  <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                    Lưu
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setIsEditing(true)} style={{ width: '90px' }}>
                  Chỉnh sửa
                </Button>
              )}
            </Form.Item>

          </Form>
        </Card>
      </div>

      {/* Right Section */}
      <div style={{ flex: 1 }}>
        <Title level={4} style={{ textAlign: 'center' }}>Thông tin bổ sung</Title>
        <Card>
          <Form layout="vertical">
            <Form.Item label="Ngày tạo ví">
              <span>
                {data.wallet?.creationDate
                  ? new Date(data.wallet.creationDate).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'Không có thông tin'}
              </span>
            </Form.Item>
            <Form.Item label="Số dư ví (VND)">
              <span>
                {data.wallet?.numberBalance
                  ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      maximumFractionDigits: 0,
                    }).format(data.wallet.numberBalance)
                  : 'Không có thông tin'}
              </span>
            </Form.Item>

            <Form.Item label="Trạng thái ví">
              <span
                style={{
                  color: data.wallet?.status === 1 ? 'green' : 'red',
                  fontWeight: 'bold',
                }}
              >
                {data.wallet?.status === 1
                  ? 'Còn hoạt động'
                  : data.wallet?.status === 2
                  ? 'Ví bị khóa'
                  : 'Không xác định'}
              </span>
            </Form.Item>
          </Form>
        </Card>
      </div>

            <Form.Item label="Số dư ví (USD)">
              <span>
                {data.wallet?.numberBalanceUSD
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(data.wallet.numberBalanceUSD)
                  : 'Không có thông tin'}
              </span>
            </Form.Item>
        {/* New Section for Address */}
        <Form.Item label="Danh sách địa chỉ: ">
        <div>
          {data.addresses && data.addresses.length > 0 ? (
            data.addresses.map((address, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <span>* Địa chỉ {index + 1}: {address.description}</span>
              </div>
            ))
          ) : (
            <span>Không có thông tin</span>
          )}
        </div>


      </Form.Item>

        </Form>
        </Card>
      </div>

    </div>
  );
};

export default AccountDetails;
