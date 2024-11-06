import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Typography, Card, Spin, message } from 'antd';
import { getContractDetails } from '../../api/contractManagement';
import moment from 'moment';

const { Title } = Typography;

const ContractDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const {data} = await getContractDetails(id);
        setContract(data);
        console.log('data: ', data)
      } catch (error) {
        console.error('Error fetching contract details:', error);
        message.error('Error fetching contract details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
    fetchContractDetails(id);
    console.log('contractid: ', id)
    }
  }, [id]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT HỢP ĐỒNG</Title>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button type="primary" shape="round">Mã HĐ: {contract.contractId}</Button>
        </div>
        <Form layout="vertical">
          <Form.Item label="Mã hợp đồng:">
            <Input value={contract.contractId} readOnly />
          </Form.Item>
          <Form.Item label="Ngày tạo hợp đồng:">
            <DatePicker value={moment(contract.creationContractDate)} style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="Ngày kết thúc hợp đồng:">
            <DatePicker value={moment(contract.endContractDate)} style={{ width: '100%' }} disabled />
          </Form.Item>
          <Form.Item label="Tổng số tiền (VND):">
            <Input value={contract.totalAmount} readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái:">
            <Input value={contract.isActive ? 'Hoạt động' : 'Không hoạt động'} readOnly />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="default" danger style={{ marginRight: '10px' }}>Hủy</Button>
            <Button type="primary">Cập nhật</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContractDetails;
