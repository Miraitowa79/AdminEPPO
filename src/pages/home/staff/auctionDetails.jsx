import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Typography, Card, Spin, message, DatePicker, Select, Image } from 'antd';
import moment from 'moment';
import { getAuctionDetails } from '../../../api/auctionManagement';

const { Title } = Typography;
const { Option } = Select;

const AuctionDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAuctionDetails = async (id) => {
      try {
        const { data } = await getAuctionDetails(id);
        setData(data);
        form.setFieldsValue({
          registrationOpenDate: moment(data.room.registrationOpenDate),
          registrationEndDate: moment(data.room.registrationEndDate),
          priceStep: data.room.priceStep,
          activeDate: moment(data.room.activeDate),
          endDate: moment(data.room.endDate),
          status: data.room.status,
          modificationBy: data.room.modificationBy,
        });
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
  }, [id, form]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT CUỘC ĐẤU GIÁ</Title>
        <Card>
          <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
            <Form.Item label="Id Phòng đấu giá">
              <Input value={data.room.roomId || ''} readOnly />
            </Form.Item>
            <Form.Item label="Ngày mở đăng ký">
              <DatePicker format="DD-MM-YYYY HH:mm:ss" showTime value={moment(data.room.registrationOpenDate)} disabled />
            </Form.Item>
            <Form.Item label="Ngày đóng đăng ký">
              <DatePicker format="DD-MM-YYYY HH:mm:ss" showTime value={moment(data.room.registrationEndDate)} disabled />
            </Form.Item>
            <Form.Item label="Phí đăng ký">
              <Input value={data.room.registrationFee || ''} readOnly />
            </Form.Item>
            <Form.Item label="Mức đấu giá">
              <Input value={data.room.priceStep || ''} readOnly />
            </Form.Item>
            <Form.Item label="Thời gian diễn ra">
              <DatePicker format="DD-MM-YYYY HH:mm:ss" showTime value={moment(data.room.activeDate)} disabled />
            </Form.Item>
            <Form.Item label="Thời gian kết thúc">
              <DatePicker format="DD-MM-YYYY HH:mm:ss" showTime value={moment(data.room.endDate)} disabled />
            </Form.Item>
            <Form.Item label="Ngày tạo cuộc đấu giá">
              <Input value={moment(data.room.creationDate).format('DD-MM-YYYY HH:mm:ss') || ''} readOnly />
            </Form.Item>
            <Form.Item label="Trạng thái cuộc đấu giá">
              <Select value={data.room.status} disabled>
                <Option value={1}>Chờ xác nhận</Option>
                <Option value={2}>Đang hoạt động</Option>
                <Option value={3}>Đấu giá thành công</Option>
                <Option value={4}>Đấu giá thất bại</Option>
                <Option value={5}>Đã hủy</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Số lượng đã đăng ký">
              <Input value={data.registeredCount || 0} readOnly />
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        <Title level={3} style={{ textAlign: 'center' }}>THÔNG TIN CÂY ĐẤU GIÁ</Title>
        <Card style={{ width: '100%', borderCollapse: 'collapse' }}>
          <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
            <Form.Item label="Tên cây">
              <Input value={data.room.plant.plantName || ''} readOnly />
            </Form.Item>
            <Form.Item label="Tiêu đề">
              <Input value={data.room.plant.title || ''} readOnly />
            </Form.Item>
            <Form.Item label="Mô tả">
              <Input.TextArea value={data.room.plant.description || ''} readOnly />
            </Form.Item>
            <Form.Item label="Hình ảnh: ">
              <Image
                src={data.room.plant.mainImage}
                alt="Plant Image"
                width={200}
                style={{ marginBottom: '10px' }}
              />
            </Form.Item>
            <Form.Item label="Giá">
              <Input value={data.room.plant.finalPrice || ''} readOnly />
            </Form.Item>
            <Form.Item label="Hình thức">
              <Input
                value={
                  data.room.plant.typeEcommerceId === 1
                    ? 'Cây bán'
                    : data.room.plant.typeEcommerceId === 2
                    ? 'Cây thuê'
                    : data.room.plant.typeEcommerceId === 3
                    ? 'Cây đấu giá'
                    : 'Không xác định'
                }
                readOnly
              />
            </Form.Item>
            <Form.Item label="Trạng thái">
              <Input value={data.room.plant.isActive ? 'Có thể đặt mua / thuê / mang vào đấu giá.' : 'Không thể thuê, mua, đấu giá.'} readOnly />
            </Form.Item>
            <Form.Item label="Ngày tạo cây">
              <Input value={moment(data.room.plant.creationDate).format('DD-MM-YYYY HH:mm:ss') || ''} readOnly />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AuctionDetails;
