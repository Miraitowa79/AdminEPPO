import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPlants } from '../../../api/plantsManagement';
import { createContract } from '../../../api/contractManagement';

const { Title } = Typography;
const { Option } = Select;

const CreateContract = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPlants = async () => {
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
        message.error('Error fetching plants');
      }
    };

    fetchPlants();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const creationContractDate = values.creationContractDate.format('YYYY-MM-DD');
      const endContractDate = values.endContractDate.format('YYYY-MM-DD');

      const newContract = {
        contractNumber: values.contractNumber,
        description: values.description,
        creationContractDate,
        endContractDate,
        totalAmount: values.totalAmount,
        contractUrl: values.contractUrl,
        contractDetails: [{
          plantId: values.plantId,
          totalPrice: values.totalPrice,
        }],
      };

      await createContract(newContract);
      message.success('Hợp đồng đã được tạo thành công!');
      navigate('/staff/contract');
    } catch (error) {
      console.error('Error creating contract:', error);
      message.error('Có lỗi xảy ra khi tạo hợp đồng.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>TẠO HỢP ĐỒNG MỚI</Title>
      <Card>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleSubmit}>
          <Form.Item name="contractNumber" label="Số hợp đồng" rules={[{ required: true, message: 'Vui lòng nhập số hợp đồng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="creationContractDate" label="Ngày tạo" rules={[{ required: true, message: 'Vui lòng chọn ngày tạo' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="endContractDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="totalAmount" label="Tổng số tiền" rules={[{ required: true, message: 'Vui lòng nhập tổng số tiền' }]}>
            <Input />
          </Form.Item>
          {/* <Form.Item name="contractUrl" label="URL hợp đồng" rules={[{ required: true, message: 'Vui lòng nhập URL hợp đồng' }]}>
            <Input />
          </Form.Item> */}
          <Form.Item name="plantId" label="Chọn cây trồng" rules={[{ required: true, message: 'Vui lòng chọn cây trồng' }]}>
            <Select placeholder="Chọn cây trồng">
              {plants.map(plant => (
                <Option key={plant.plantId} value={plant.plantId}>
                  {plant.plantName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="totalPrice" label="Tổng giá" rules={[{ required: true, message: 'Vui lòng nhập tổng giá' }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Tạo Hợp Đồng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateContract;
