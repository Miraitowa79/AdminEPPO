import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPlants } from '../../api/plantsManagement';
import { getAccounts } from '../../api/accountManagement';
import { createAuctionRoom } from '../../api/auctionManagement';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const CreateAuctionRoom = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getPlants({});
        setPlants(data);
      } catch (error) {
        console.error('Error fetching plants:', error);
        message.error('Error fetching plants');
      }
    };

    const fetchAllAccounts = async () => {
        try {
          const response = await getAccounts({});
          const {data} = response;
          setAccounts(data);
        } catch (error) {
          console.error('Error fetching accounts:', error);
          message.error('Error fetching accounts');
        }
      };

    fetchPlants();
    fetchAllAccounts();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const creationDate = values.creationDate.toISOString();
      const activeDate = values.activeDate.toISOString();
      const endDate = values.endDate.toISOString();

      if (new Date(endDate) - new Date(activeDate) > 3600000) {
        message.error('End date cannot be more than 1 hour after active date');
        return;
      }

      const newRoom = {
        plantId: values.plantId,
        creationDate,
        activeDate,
        endDate,
        modificationDate: creationDate,
        modificationBy: values.modificationBy,
        status: values.status,
      };

      await createAuctionRoom(newRoom);
      message.success('Auction room created successfully');
      navigate('/management/auction');
    } catch (error) {
      console.error('Error creating auction room:', error);
      message.error('Error creating auction room');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>CREATE AUCTION ROOM</Title>
      <Card>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleSubmit}>
          <Form.Item name="plantId" label="Select Plant" rules={[{ required: true, message: 'Please select a plant' }]}>
            <Select placeholder="Select a plant">
              {plants.map(plant => (
                <Option key={plant.plantId} value={plant.plantId}>
                  {plant.plantName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="modificationBy" label="Modified By" rules={[{ required: true, message: 'Please select a modifier' }]}>
            <Select placeholder="Select a modifier">
              {accounts.map(account => (
                <Option key={account.id} value={account.id}>
                  {account.roleId}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
            <Select placeholder="Select status">
              <Option value={1}>Active</Option>
              <Option value={0}>Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item name="creationDate" label="Creation Date" rules={[{ required: true, message: 'Please select a creation date' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="activeDate" label="Active Date" rules={[{ required: true, message: 'Please select an active date' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select an end date' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Create Room
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAuctionRoom;
