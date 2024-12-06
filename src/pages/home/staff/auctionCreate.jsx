import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, DatePicker, message, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getListPlantAuction } from '../../../api/plantsManagement';
import { createAuctionRoom } from '../../../api/auctionManagement';
import { getAuthUser } from '@src/utils';

const { Title } = Typography;
const { Option } = Select;

const CreateAuctionRoom = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState({ plantName: '', finalPrice: '' });
  const [form] = Form.useForm();
  const currentUser = getAuthUser();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await getListPlantAuction({});
        const { data } = response;
        setPlants(data);
      } catch (error) {
        console.error('Error fetching plants:', error);
        message.error('Error fetching plants');
      }
    };

    form.setFieldsValue({
      modificationBy: currentUser.fullName,
      creationDate: moment(),
      modificationDate: moment(),
    });

    fetchPlants();
  }, [form, currentUser.fullName]);

  const handlePlantChange = (plantId) => {
    const plant = plants.find(p => p.plantId === plantId);
    if (plant) {
      setSelectedPlant(plant);
      const registrationFee = plant.finalPrice * 0.05;
      form.setFieldsValue({ registrationFee });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const registrationOpenDate = values.registrationOpenDate.toISOString();
      const registrationEndDate = values.registrationEndDate.toISOString();
      const creationDate = moment().toISOString();
      const activeDate = values.activeDate.toISOString();
      const endDate = values.endDate.toISOString();
      const modificationDate = creationDate;

      if (moment(registrationEndDate).isBefore(registrationOpenDate)) {
        message.error('Ngày đóng đăng ký phải sau ngày mở đăng ký');
        return;
      }

      if (moment(activeDate).isBefore(registrationEndDate)) {
        message.error('Ngày hoạt động phải sau ngày đóng đăng ký');
        return;
      }

      if (moment(endDate).isBefore(activeDate)) {
        message.error('Ngày kết thúc phải sau ngày hoạt động');
        return;
      }

      const newRoom = {
        plantId: values.plantId,
        registrationOpenDate,
        registrationEndDate,
        registrationFee: values.registrationFee,
        priceStep: values.priceStep,
        activeDate,
        endDate,
        modificationBy: getAuthUser().userId,
        status: values.status,
      };

      await createAuctionRoom(newRoom);
      message.success('Auction room created successfully');
      navigate('/staff/auction');
    } catch (error) {
      console.error('Error creating auction room:', error);
      message.error('Tạo phòng không thành công!');
    }
  };

  const handleCancel = () => {
    navigate('/staff/auction');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 3 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Tạo phòng đấu giá</Title>
        <Card>
          <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleSubmit}>
            <Form.Item name="plantId" label="Chọn cây" rules={[{ required: true, message: 'Hãy chọn cây!' }]}>
              <Select placeholder="Chọn cây" onChange={handlePlantChange}>
                {plants.filter(plant => plant.isActive === true).map(plant => (
                  <Option key={plant.plantId} value={plant.plantId}>
                    {plant.plantName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item 
              name="registrationOpenDate" 
              label="Ngày mở đăng ký" 
              rules={[
                { required: true, message: 'Hãy chọn 1 ngày mở đăng ký' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.isAfter(moment())) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian mở đăng ký phải từ sau ngày hôm nay'));
                  },
                }),
              ]}
            >
              <DatePicker showTime placeholder='Chọn ngày' />
            </Form.Item>

            <Form.Item 
              name="registrationEndDate" 
              label="Ngày đóng đăng ký" 
              rules={[
                { required: true, message: 'Hãy chọn 1 ngày đóng đăng ký' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const openDate = getFieldValue('registrationOpenDate');
                    if (!value || (openDate && value.isAfter(openDate.add(30, 'minutes')))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian đóng đăng ký phải từ sau thời gian mở đăng ký ít nhất 30 phút'));
                  },
                }),
              ]}
            >
              <DatePicker showTime placeholder='Chọn ngày' />
            </Form.Item>
            <Form.Item name="registrationFee" label="Phí đăng ký tham gia">
              <Input type="number" placeholder='Phí đăng ký = 5% * giá cây' readOnly />
            </Form.Item>
            <Form.Item 
              name="priceStep" 
              label="Mức đấu giá" 
              rules={[
                { required: true, message: 'Hãy nhập mức đấu giá' },
                () => ({
                  validator(_, value) {
                    if (!value || (value >= 10000 && value <= 500000 && value % 5000 === 0)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mức đấu giá phải từ 10,000 đến 500,000 và là bội số của 5,000'));
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder='Nhập mức tăng mỗi lần đấu giá'
                min={10000}
                max={500000}
                step={5000}
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\D/g, '')} // Display only digits
                parser={value => value.replace(/\D/g, '')} // Parse only digits
              />
            </Form.Item>
            <Form.Item 
              name="activeDate" 
              label="Ngày hoạt động" 
              rules={[
                { required: true, message: 'Hãy chọn ngày đấu giá hoạt động' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const endDate = getFieldValue('registrationEndDate');
                    if (!value || (endDate && value.isAfter(endDate))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian hoạt động phải từ sau thời gian đóng đăng ký'));
                  },
                }),
              ]}
            >
              <DatePicker showTime placeholder='Chọn ngày' />
            </Form.Item>

            <Form.Item 
              name="endDate" 
              label="Ngày kết thúc" 
              rules={[
                { required: true, message: 'Hãy chọn ngày kết thúc đấu giá' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const activeDate = getFieldValue('activeDate');
                    if (!value || (activeDate && value.isAfter(activeDate.add(30, 'minutes')))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Thời gian kết thúc phải từ sau thời gian hoạt động ít nhất 30 phút'));
                  },
                }),
              ]}
            >
              <DatePicker showTime placeholder='Chọn ngày' />
            </Form.Item>
            <Form.Item name="modificationBy" label="Người thực hiện">
              <Input readOnly />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit" style={{ width: 'calc(50% - 10px)', marginRight: '20px' }}>
                Tạo phòng
              </Button>
              <Button type="default" onClick={handleCancel} style={{ width: 'calc(50% - 10px)' }}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Cây đấu giá</Title>
        <Card>
          <p><strong>Tên cây:</strong> {selectedPlant.plantName || '-'}</p>
          <p><strong>Giá:</strong> {selectedPlant.finalPrice || '-'}</p>
        </Card>
      </div>
    </div>
  );
};

export default CreateAuctionRoom;
