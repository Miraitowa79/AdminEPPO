import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Spin, message, Select, Row, Col, Image } from 'antd';
import { getOrderDetails, updateOrderDetails } from '../../../api/orderManagement';
import { getAccountDetails } from '../../../api/accountManagement';
import { getTypeEcommerceById } from '../../../api/typeEcommerceApi';
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
        const { data: order } = await getOrderDetails(id);
        setOrderData(order);

        if (order.userId) {
          const { data: user } = await getAccountDetails(order.userId);
          setUserData(user);
        }

        if (order.typeEcommerceId) {
          const { data: typeEcommerce } = await getTypeEcommerceById(order.typeEcommerceId);
          setTypeEcommerceTitle(typeEcommerce);
        }

        form.setFieldsValue({
          ...order,
          creationDate: moment(order.creationDate).format('DD-MM-YYYY'),
          modificationDate: moment(order.modificationDate).format('DD-MM-YYYY'),
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
      const currentStatus = orderData.status;
      const newStatus = updatedData.status;

      if (newStatus <= currentStatus) {
        message.error('Không thể quay lại trạng thái trước đó.');
        return;
      }

      const newModificationDate = moment().format('YYYY-MM-DD');
      const updatedOrderData = {
        ...orderData,
        status: updatedData.status,
        modificationDate: newModificationDate,
      };
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
      case 6:
        return 'Thu hồi';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>THÔNG TIN ĐƠN HÀNG</Title>
      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Button type="primary" shape="round">Mã đơn hàng: {orderData.orderId}</Button>
            </div>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              onFinish={handleFinish}
            >
              <Form.Item label="Khách hàng">
                <Input value={userData.fullName || 'N/A'} readOnly />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input value={userData.phoneNumber || 'N/A'} readOnly />
              </Form.Item>
              <Form.Item label="Địa chỉ giao hàng" name="deliveryAddress">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Giá cây" name="totalPrice">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Phí giao hàng" name="deliveryFee">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Tổng đơn hàng" name="finalPrice">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Loại hình thức">
                <Input value={typeEcommerceTitle.title} readOnly />
              </Form.Item>
              <Form.Item label="Ngày mua" name="creationDate">
                <Input value={moment(orderData.creationDate).format('DD-MM-YYYY')} readOnly />
              </Form.Item>
              <Form.Item label="Trạng thái thanh toán" name="paymentStatus">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Tình trạng giao hàng" name="deliveryDescription">
                <Input value={orderData.deliveryDescription} readOnly />
              </Form.Item>
              <Form.Item label="Trạng thái đơn hàng" name="status">
                {editMode ? (
                  <Select style={{ width: '100%' }}>
                    {orderData.status < 2 && <Option value={2}>Đang chuẩn bị hàng</Option>}
                    {orderData.status < 3 && <Option value={3}>Đang giao</Option>}
                    {orderData.status < 4 && <Option value={4}>Đã giao</Option>}
                    {orderData.status < 4 && <Option value={5}>Đã hủy</Option>}
                    {orderData.status == 4 && <Option value={6}>Thu hồi</Option>}
                  </Select>
                ) : (
                  <Select value={orderData.status} disabled style={{ width: '100%' }}>
                    <Option value={1}>Chờ xác nhận</Option>
                    <Option value={2}>Đang chuẩn bị hàng</Option>
                    <Option value={3}>Đang giao</Option>
                    <Option value={4}>Đã giao</Option>
                    <Option value={5}>Đã hủy</Option>
                    <Option value={6}>Thu hồi</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                {editMode ? (
                  <>
                    <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelClick}>Hủy</Button>
                    <Button type="primary" htmlType="submit">Lưu</Button>
                  </>
                ) : (
                  <>
                    {orderData.status !== 5 && orderData.status !== 6 && (
                      <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
                    )}
                  </>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          {orderData.typeEcommerceId === 2 && ( // Assuming 2 is the ID for rental
            <Card title="Chi tiết đơn hàng">
              {orderData.orderDetails && orderData.orderDetails.map(detail => (
                <div key={detail.orderDetailId} style={{ marginBottom: '10px' }}>
                  <p><strong>Mã cây:</strong> {detail.plantId}</p>
                  <p><strong>Ngày bắt đầu thuê:</strong> {detail.rentalStartDate ? moment(detail.rentalStartDate).format('DD-MM-YYYY') : 'N/A'}</p>
                  <p><strong>Ngày kết thúc thuê:</strong> {detail.rentalEndDate ? moment(detail.rentalEndDate).format('DD-MM-YYYY') : 'N/A'}</p>
                  <p><strong>Số tháng thuê:</strong> {detail.numberMonth || '0'}</p>
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Tiền đặt cọc:</strong> {detail.deposit || '0'}</p>
                    <p><strong>Mô tả đặt cọc:</strong> {detail.depositDescription || '-'}</p>
                    <p><strong>Tiền trả lại khách hàng:</strong> {detail.depositReturnCustomer || '0'}</p>
                    <p><strong>Tiền trả lại chủ sở hữu:</strong> {detail.depositReturnOwner || '0'}</p>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Scrollable Image Delivery Orders */}
          <Card title="Hình ảnh giao hàng" style={{ marginTop: '16px' }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {orderData.imageDeliveryOrders && orderData.imageDeliveryOrders.length > 0 ? (
              orderData.imageDeliveryOrders.map((imageOrder) => (
                <Image
                  key={imageOrder.imageDeliveryOrderId}
                  src={imageOrder.imageUrl}
                  alt={`Delivery ${imageOrder.imageDeliveryOrderId}`}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
              ))
            ) : (
              <p>Không có hình ảnh</p>
            )}
            </div>
            
          </Card>

          {/* Scrollable Image Return Orders */}
          <Card title="Hình ảnh trả hàng" style={{ marginTop: '16px' }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {orderData.imageReturnOrders && orderData.imageReturnOrders.length > 0 ? (
                orderData.imageReturnOrders.map((image, index) => (
                  <Image key={index} src={image.imageUrl} alt={`Return ${index}`} style={{ width: '100%', marginBottom: '10px' }} />
                ))
              ) : (
                <p>Không có hình ảnh</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;
