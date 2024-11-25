import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getListPlantAuction } from '../../../api/plantsManagement';
import { getAccounts } from '../../../api/accountManagement';
import { createAuctionRoom } from '../../../api/auctionManagement';
import {getAuthUser} from '@src/utils'

const { Title } = Typography;
const { Option } = Select;

const CreateAuctionRoom = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState({ plantName: '', finalPrice: '' });
  const [form] = Form.useForm();

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

    const fetchAllAccounts = async () => {
      try {
        const response = await getAccounts({});
        const { data } = response;
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        message.error('Error fetching accounts');
      }
    };

    form.setFieldsValue({ modificationBy: getAuthUser().fullName });

    fetchPlants();
    fetchAllAccounts();
  }, []);

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
      const registrationOpenDate = values.registrationOpenDate ? values.registrationOpenDate.toISOString() : null;
      const registrationEndDate = values.registrationEndDate ? values.registrationEndDate.toISOString() : null;
      const creationDate = values.creationDate ? values.creationDate.toISOString() : null;
      const activeDate = values.activeDate ? values.activeDate.toISOString() : null;
      const endDate = values.endDate ? values.endDate.toISOString() : null;

      if (!registrationOpenDate || !registrationEndDate || !activeDate || !endDate) {
        message.error('Vui lòng chọn tất cả các ngày cần thiết');
        return;
      }

      const newRoom = {
        plantId: values.plantId,
        registrationOpenDate,
        registrationEndDate,
        registrationFee: values.registrationFee,
        priceStep: values.priceStep,
        creationDate,
        activeDate,
        endDate,
        modificationDate: creationDate,
        modificationBy: values.modificationBy,
        status: values.status,
      };

      await createAuctionRoom(newRoom);
      message.success('Auction room created successfully');
      navigate('/staff/auction');
    } catch (error) {
      console.error('Error creating auction room:', error);
      message.error('Error creating auction room');
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
                {plants.map(plant => (
                  <Option key={plant.plantId} value={plant.plantId}>
                    {plant.plantName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="registrationOpenDate" label="Ngày mở đăng ký" rules={[{ required: true, message: 'Hãy chọn 1 ngày mở đăng ký' }]}>
              <DatePicker showTime placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item name="registrationEndDate" label="Ngày đóng đăng ký" rules={[{ required: true, message: 'Hãy chọn 1 ngày đóng đăng ký' }]}>
              <DatePicker showTime placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item name="registrationFee" label="Phí đăng ký tham gia">
              <Input type="number" placeholder='Phí đăng ký = 5% * giá cây' readOnly />
            </Form.Item>
            <Form.Item name="priceStep" label="Mức đấu giá" rules={[{ required: true, message: 'Hãy nhập mức đấu gia' }]}>
              <Input type="number" placeholder='Nhập mức tăng mỗi lần đấu giá'/>
            </Form.Item>
            {/* <Form.Item name="creationDate" label="Ngày tạo" rules={[{ required: true, message: 'Please select a creation date' }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item> */}
            <Form.Item name="activeDate" label="Ngày hoạt động" rules={[{ required: true, message: 'Hãy chọn ngày đấu giá hoạt động' }]}>
              <DatePicker showTime placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item name="endDate" label="Ngày két thúc" rules={[{ required: true, message: 'Hãy chọn ngày kết thúc đấu giá' }]}>
              <DatePicker showTime placeholder='Chọn ngày'/>
            </Form.Item>
            <Form.Item name="modificationBy" label="Người thực hiện">
              {/* <Select placeholder="Select a modifier">
                {accounts.map(account => (
                  <Option key={account.userId} value={account.userId}>
                    {account.userName}
                  </Option>
                ))}
              </Select> */}
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
