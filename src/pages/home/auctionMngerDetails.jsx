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
          <Form.Item label="Id Phòng đấu giá">
            <Input value={data.roomId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Tên cây">
            <Input value={data.plant?.plantName || ''} readOnly />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea value={data.plant?.description || ''} readOnly />
          </Form.Item>
          <Form.Item label="Số lượng">
            <Input value={data.plant?.quantity || ''} readOnly />
          </Form.Item>
          <Form.Item label="Giá ban đầu">
            <Input value={data.plant?.price || ''} readOnly />
          </Form.Item>
          <Form.Item label="Giảm giá">
            <Input value={data.plant?.discounts || ''} readOnly />
          </Form.Item>
          <Form.Item label="Giá cuối cùng">
            <Input value={data.plant?.finalPrice || ''} readOnly />
          </Form.Item>
          <Form.Item label="Loại cây">
            <Input value={data.plant?.categoryId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Type Ecommerce ID">
            <Input value={data.plant?.typeEcommerceId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái của cây">
            <Input value={data.plant?.status === 1 ? 'Active' : 'Inactive'} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Input value={data.plant?.isActive ? 'Hoạt động' : 'Không hoạt động'} readOnly />
          </Form.Item>
          <Form.Item label="Ngày tạo thông tin cây">
            <Input value={new Date(data.plant?.creationDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Mã cây">
            <Input value={data.plant?.code || ''} readOnly />
          </Form.Item>
          <Form.Item label="Ngày tạo cuộc đấu giá">
            <Input value={new Date(data.creationDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Thời gian diễn ra">
            <Input value={new Date(data.activeDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Thời gian kết thúc">
            <Input value={new Date(data.endDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái của cuộc đấu giá">
            <Input value={data.status === 1 ? 'Hoạt động' : 'Không hoạt động'} readOnly />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuctionDetails;
