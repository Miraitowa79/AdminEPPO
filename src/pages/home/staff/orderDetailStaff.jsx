import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Spin, message, Select } from 'antd';
import { getOrderDetails, updateOrderDetails } from '../../../api/orderManagement';
import { getAccountDetails } from '../../../api/accountManagement';
import { getTypeEcommerceById } from '../../../api/typeEcommerceApi'; // Sử dụng hàm mới
import moment from 'moment';
import './orderDetailStaff.scss';

const { Title } = Typography;
const { Option } = Select;

const OrderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({});
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [typeEcommerceTitle, setTypeEcommerceTitle] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Lấy thông tin đơn hàng
        const { data: order } = await getOrderDetails(id);
        setOrderData(order);

        // Lấy thông tin người dùng
        if (order.userId) {
          const { data: user } = await getAccountDetails(order.userId);
          setUserData(user);
        }

        // Lấy thông tin loại hình TMĐT
        if (order.typeEcommerceId) {
          const { data: typeEcommerce } = await getTypeEcommerceById(order.typeEcommerceId);
          setTypeEcommerceTitle(typeEcommerce);
        }

        // Đặt giá trị cho form
        form.setFieldsValue({
          ...order,
          creationDate: moment(order.creationDate).format('YYYY-MM-DD'),
          modificationDate: moment(order.modificationDate).format('YYYY-MM-DD'),
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        message.error('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, form]);

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    form.setFieldsValue(orderData);
  };

  const handleFinish = async (updatedData) => {
    try {
      const newModificationDate = moment().format('YYYY-MM-DD');
      const updatedOrderData = { ...orderData, ...updatedData, modificationDate: newModificationDate };
      await updateOrderDetails(updatedOrderData);
      setOrderData(updatedOrderData);
      setEditMode(false);
      message.success('Cập nhật đơn hàng thành công!');
    } catch (error) {
      message.error('Error updating order details');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Đang chuẩn bị hàng';
      case 3:
        return 'Đang giao';
      case 4:
        return 'Đã giao';
      case 5:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT ĐƠN HÀNG</Title>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button type="primary" shape="round">Mã đơn hàng: {orderData.orderId}</Button>
        </div>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          onFinish={handleFinish}
        >
          <Form.Item label="Người dùng" className={editMode ? 'blurred-field' : ''}>
            <Input value={userData.userName || 'N/A'} readOnly />
          </Form.Item>
          <Form.Item label="Địa chỉ giao hàng" name="deliveryAddress" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Giá cuối cùng" name="finalPrice" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Loại hình TMĐT" className={editMode ? 'blurred-field' : ''}>
            <Input value={typeEcommerceTitle.title} readOnly />
          </Form.Item>
          <Form.Item label="Ngày tạo" name="creationDate" className={editMode ? 'blurred-field' : ''}>
            <Input value={moment(orderData.creationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>
          <Form.Item label="Ngày sửa đổi" name="modificationDate" className={editMode ? 'blurred-field' : ''}>
            <Input value={moment(orderData.modificationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
            {editMode ? (
              <Select defaultValue={orderData.paymentStatus} style={{ width: '100%' }}>
                <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                <Option value="Đã thanh toán">Đã thanh toán</Option>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
            ) : (
              <Input value={orderData.paymentStatus} readOnly />
            )}
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng" name="status">
            {editMode ? (
              <Select defaultValue={orderData.status} style={{ width: '100%' }}>
                <Option value={1}>Chờ xác nhận</Option>
                <Option value={2}>Đang chuẩn bị hàng</Option>
                <Option value={3}>Đang giao</Option>
                <Option value={4}>Đã giao</Option>
                <Option value={5}>Đã hủy</Option>
              </Select>
            ) : (
              <Input value={getStatusText(orderData.status)} readOnly />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            {editMode ? (
              <>
                <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelClick}>Hủy</Button>
                <Button type="primary" htmlType="submit">Lưu</Button>
              </>
            ) : (
              <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderDetails;
