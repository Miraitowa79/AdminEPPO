import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Typography, Card, Spin, message } from 'antd';
import { getAuctionDetails } from '../../api/auctionManagement';

const { Title } = Typography;

const AuctionDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchAuctionDetails = async (id) => {
      try {
        const { data } = await getAuctionDetails(id);
        setData(data);
      } catch (error) {
        console.error('Error fetching auction details:', error);
        message.error('Error fetching auction details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionDetails(id);
    }
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>AUCTION DETAILS</Title>
      <Card>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left">
          <Form.Item label="Room ID">
            <Input value={data.roomId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Plant Name">
            <Input value={data.plant?.plantName || ''} readOnly />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea value={data.plant?.description || ''} readOnly />
          </Form.Item>
          <Form.Item label="Quantity">
            <Input value={data.plant?.quantity || ''} readOnly />
          </Form.Item>
          <Form.Item label="Price">
            <Input value={data.plant?.price || ''} readOnly />
          </Form.Item>
          <Form.Item label="Discounts">
            <Input value={data.plant?.discounts || ''} readOnly />
          </Form.Item>
          <Form.Item label="Final Price">
            <Input value={data.plant?.finalPrice || ''} readOnly />
          </Form.Item>
          <Form.Item label="Category ID">
            <Input value={data.plant?.categoryId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Type Ecommerce ID">
            <Input value={data.plant?.typeEcommerceId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Plant Status">
            <Input value={data.plant?.status === 1 ? 'Active' : 'Inactive'} readOnly />
          </Form.Item>
          <Form.Item label="Is Active">
            <Input value={data.plant?.isActive ? 'Yes' : 'No'} readOnly />
          </Form.Item>
          <Form.Item label="Plant Creation Date">
            <Input value={new Date(data.plant?.creationDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Code">
            <Input value={data.plant?.code || ''} readOnly />
          </Form.Item>
          <Form.Item label="Auction Creation Date">
            <Input value={new Date(data.creationDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Active Date">
            <Input value={new Date(data.activeDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="End Date">
            <Input value={new Date(data.endDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Auction Status">
            <Input value={data.status === 1 ? 'Active' : 'Inactive'} readOnly />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuctionDetails;
