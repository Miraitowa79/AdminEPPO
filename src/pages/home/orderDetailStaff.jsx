import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Spin, message } from 'antd';
import { getOrderDetails, updateOrderDetails } from '../../api/orderManagement';
import { getAccountDetails } from '../../api/accountManagement';
import moment from 'moment';
import './orderDetailStaff.scss';

const { Title } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({});
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrderDetails = async (id) => {
      try {
        const response = await getOrderDetails(id);
        const order = response.data;
        setOrderData(order);
        form.setFieldsValue(order);

        const userResponse = await getAccountDetails(order.userId);
        const user = userResponse.data;
        setUserData(user);
      } catch (error) {
        console.error('Error fetching order details:', error);
        message.error('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails(id);
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
          <Form.Item label="Người dùng" name="userId" className={editMode ? 'blurred-field' : ''}>
            <Input value={userData.userId || 'N/A'} readOnly />
          </Form.Item>
          <Form.Item label="Tổng giá" name="totalPrice" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Phí giao hàng" name="deliveryFee" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Địa chỉ giao hàng" name="deliveryAddress" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Giá cuối cùng" name="finalPrice" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Ngày tạo" name="creationDate" className={editMode ? 'blurred-field' : ''}>
            <Input value={moment(orderData.creationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>
          <Form.Item label="Ngày sửa đổi" name="modificationDate" className={editMode ? 'blurred-field' : ''}>
            <Input value={moment(orderData.modificationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
            <Input readOnly={!editMode} style={editMode ? { backgroundColor: '#e6f7ff' } : {}} />
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
