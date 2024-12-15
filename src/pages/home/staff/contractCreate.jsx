import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, DatePicker, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPlants, getPlantDetails } from '../../../api/plantsManagement';
import { createContract } from '../../../api/contractManagement';
import { getOrders, getOrderDetails } from '../../../api/orderManagement';
import { getAccountDetails } from '../../../api/accountManagement';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const CreateContract = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [plantDetails, setPlantDetails] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const response = await getPlants({});
        const { data } = response;
        if (Array.isArray(data)) {
          const filteredPlants = data.filter(plant => plant.typeEcommerceId === 2);
          setPlants(filteredPlants);
        } else {
          setPlants([]);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
        message.error('Không có dữ liệu cây!');
      } finally {
        setLoading(false);
      }
    };
  
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders({ pageSize: 5000 });
        const { data } = response;
        if (Array.isArray(data)) {
          const filteredOrders = data.filter(order => order.typeEcommerceId === 2);
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        message.error('Không có dữ liệu đơn hàng!');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlants();
    fetchOrders();
  
    form.setFieldsValue({
      creationContractDate: moment(),
    });
  }, [form]);

  const handleOrderChange = async (orderId) => {
    setLoading(true);
    try {
      const response = await getOrderDetails(orderId);
      const { data: orderData } = response;
      if (orderData) {
        const plantId = orderData.orderDetails[0]?.plantId;
        setOrderDetails(orderData);
        form.setFieldsValue({
          contractNumber: orderId,
          totalAmount: orderData.finalPrice,
          plantId: plantId,
        });
  
        if (orderData.userId) {
          const userResponse = await getAccountDetails(orderData.userId);
          const { data: userData } = userResponse;
          setFullName(userData.fullName);
        }
  
        if (plantId) {
          const plantResponse = await getPlantDetails(plantId);
          const { data: plantData } = plantResponse;
          setPlantDetails(plantData);
          form.setFieldsValue({
            totalPrice: plantData.finalPrice,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Không có dữ liệu đơn hàng chi tiết.');
    } finally {
      setLoading(false);
    }
  };
  
  const getTypeEcommerceDescription = (typeId) => {
    switch (typeId) {
      case 1:
        return 'Mua bán';
      case 2:
        return 'Cho thuê';
      case 3:
        return 'Đấu giá';
      default:
        return 'Không xác định';
    }
  };  

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const creationContractDate = values.creationContractDate.startOf('day').add(7, 'hours').toISOString();
      const endContractDate = values.endContractDate.startOf('day').add(7, 'hours').toISOString();

      const newContract = {
        contractNumber: values.contractNumber,
        description: values.description,
        creationContractDate,
        endContractDate,
        totalAmount: values.totalAmount,
        contractUrl: null,
        contractDetails: [{
          plantId: values.plantId,
          totalPrice: values.totalPrice,
        }],
      };

      console.log("send data: ", newContract)
      
      await createContract(newContract);
      message.success('Hợp đồng đã được tạo thành công!');
      navigate('/staff/contract');
    } catch (error) {
      console.error('Error creating contract:', error);
      message.error('Có lỗi xảy ra khi tạo hợp đồng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex' }}>
      <div style={{ flex: 2 }}>
        <Title level={3} style={{ textAlign: 'center' }}>TẠO HỢP ĐỒNG MỚI</Title>
          <Card>
            <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleSubmit}>
              <Form.Item name="contractNumber" label="Mã đơn hàng" rules={[{ required: true, message: 'Vui lòng chọn mã đơn hàng' }]}>
                <Select placeholder="Chọn mã đơn hàng" onChange={handleOrderChange}>
                  {orders.map(order => (
                    <Option key={order.orderId} value={order.orderId}>
                      {order.contractNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <Input placeholder="Vui lòng nhập mô tả về hợp đồng" />
              </Form.Item>
              <Form.Item name="creationContractDate" label="Ngày tạo" rules={[{ required: true, message: 'Vui lòng chọn ngày tạo' }]}>
                <DatePicker
                  format="DD-MM-YYYY"
                  disabledDate={current => current && current < moment().startOf('day')}
                  defaultValue={moment()}
                  disabled
                />
              </Form.Item>
              <Form.Item name="endContractDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
                <DatePicker
                  format="DD-MM-YYYY"
                  placeholder='Chọn ngày'
                  disabledDate={current => {
                    const creationDate = form.getFieldValue('creationContractDate');
                    return current && (current < moment().startOf('day') || (creationDate && current <= creationDate));
                  }}
                />
              </Form.Item>
              <Form.Item name="totalAmount" label="Tổng số tiền" rules={[{ required: true, message: 'Vui lòng nhập tổng số tiền' }]}>
                <Input placeholder='Giá trị hợp đồng' readOnly />
              </Form.Item>
              <Form.Item name="plantId" label="Plant ID" hidden>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                  Tạo Hợp Đồng
                </Button>
              </Form.Item>
            </Form>
          </Card>
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
      <Spin spinning={loading} tip="Loading...">
          <Card title="Chi tiết Đơn hàng">
          <p><strong>Khách hàng:</strong> {orderDetails ? fullName : '-'}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {orderDetails ? orderDetails.deliveryAddress : '-'}</p>
          <p><strong>Tổng giá:</strong> {orderDetails ? orderDetails.finalPrice : '-'}</p>
          <p><strong>Hình thức:</strong> {orderDetails ? getTypeEcommerceDescription(orderDetails.typeEcommerceId) : '-'}</p>
          <p><strong>Trạng thái thanh toán:</strong> {orderDetails ? orderDetails.paymentStatus : '-'}</p>
          <p><strong>Ngày tạo:</strong> {orderDetails ? moment(orderDetails.creationDate).format('DD-MM-YYYY') : '-'}</p>
        </Card>
      </Spin>
      <Spin spinning={loading} tip="Loading...">
        <Card title="Chi tiết Cây" style={{ marginTop: '16px' }}>
          <p><strong>Tên cây:</strong> {plantDetails ? plantDetails.plantName : '-'}</p>
          <p><strong>Mô tả:</strong> {plantDetails ? plantDetails.description : '-'}</p>
          <p><strong>Giá:</strong> {plantDetails ? plantDetails.finalPrice : '-'}</p>
        </Card>
      </Spin>
      </div>
    </div>
  );
};

export default CreateContract;
