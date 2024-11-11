// src/components/OrderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, message } from 'antd';
import { getOrderDetails } from '../../api/orderManagement';
import { getAccountDetails } from '../../api/accountManagement';

const { Title } = Typography;

const OrderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({});
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async (id) => {
      try {
        const order = await getOrderDetails(id);
        setOrderData(order);

        // Fetch user details
        const user = await getAccountDetails(order.userId);
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
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT ĐƠN HÀNG</Title>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <strong>Mã đơn hàng:</strong> {orderData.orderId}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Người dùng:</strong> {userData.name || 'N/A'}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Mô tả:</strong> {orderData.description}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Tổng giá:</strong> {orderData.totalPrice}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Phí giao hàng:</strong> {orderData.deliveryFee}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Địa chỉ giao hàng:</strong> {orderData.deliveryAddress}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Trạng thái thanh toán:</strong> {orderData.paymentStatus}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Ngày tạo:</strong> {orderData.creationDate}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
