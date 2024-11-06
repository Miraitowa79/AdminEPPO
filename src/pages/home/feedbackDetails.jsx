import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Typography, Card, Spin, message, Avatar } from 'antd';
import { getFeedbackDetails } from '../../api/feedbackManagement';

const { Title } = Typography;

const FeedbackDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchFeedbackDetails = async (id) => {
      try {
        const { data } = await getFeedbackDetails(id);
        setData(data);
      } catch (error) {
        console.error('Error fetching feedback details:', error);
        message.error('Error fetching feedback details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedbackDetails(id);
    }
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>FEEDBACK DETAILS</Title>
      <Card>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left">
          <Form.Item label="Feedback ID">
            <Input value={data.feedbackId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Title">
            <Input value={data.title || ''} readOnly />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea value={data.description || ''} readOnly />
          </Form.Item>
          <Form.Item label="Creation Date">
            <Input value={new Date(data.creationDate).toLocaleString() || ''} readOnly />
          </Form.Item>
          <Form.Item label="Plant ID">
            <Input value={data.plantId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Rating">
            <Input value={data.rating !== null ? data.rating : 'Not rated'} readOnly />
          </Form.Item>
          <Form.Item label="User ID">
            <Input value={data.userId || ''} readOnly />
          </Form.Item>
          <Form.Item label="Modification Date">
            <Input value={data.modificationDate ? new Date(data.modificationDate).toLocaleString() : ''} readOnly />
          </Form.Item>
          <Form.Item label="Modified By User ID">
            <Input value={data.modificationByUserId || 'N/A'} readOnly />
          </Form.Item>
          <Form.Item label="Status">
            <Input value={data.status === 1 ? 'Active' : 'Inactive'} readOnly />
          </Form.Item>
          <Form.Item label="Images">
            {data.imageFeedbacks && data.imageFeedbacks.map((img) => (
              <Avatar key={img.imgageFeedbackId} src={img.imageUrl} shape="square" size={64} style={{ marginRight: '10px' }} />
            ))}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FeedbackDetails;
