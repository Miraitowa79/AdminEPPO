import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Card, message, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
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
        console.error('Lỗi khi lấy dữ liệu cây:', error);
        message.error('Không có dữ liệu cây.');
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
      const registrationOpenDate = moment(values.registrationOpenDate).add(7, 'hours').utc().toISOString();
      const registrationEndDate = moment(values.registrationEndDate).add(7, 'hours').utc().toISOString();
      const creationDate = moment().add(7, 'hours').utc().toISOString();
      const activeDate = moment(values.activeDate).add(7, 'hours').utc().toISOString();
      const endDate = moment(values.endDate).add(7, 'hours').utc().toISOString();
      const modificationDate = creationDate;

      const newRoom = {
        plantId: values.plantId,
        registrationOpenDate,
        registrationEndDate,
        registrationFee: values.registrationFee,
        priceStep: values.priceStep,
        creationDate,
        activeDate,
        endDate,
        modificationDate,
        modificationBy: getAuthUser().userId,
        status: values.status,
      };

      await createAuctionRoom(newRoom);
      message.success('Lên kế hoạch và tạo phòng đấu giá thành công.');
      navigate('/staff/auction');
    } catch (error) {
      console.error('Lỗi khi tạo phòng đấu giá:', error);
      message.error('Tạo phòng không thành công!');
    }
  };

  const handleCancel = () => {
    navigate('/staff/auction');
  };

  const validateDate = (current) => {
    return current.isAfter(moment().subtract(1, 'day'));
  };

  const validateDateInput = (_, value) => {
    if (!value || moment(value).isAfter(moment())) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Ngày không được là ngày trong quá khứ!'));
  };

  const renderDateTimePicker = (name, label) => (
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required: true, message: `Hãy chọn ${label.toLowerCase()}!` },
        { validator: validateDateInput },
      ]}
    >
      <Datetime
        dateFormat="DD-MM-YYYY"
        timeFormat="HH:mm"
        inputProps={{ placeholder: 'Chọn ngày và giờ' }}
        isValidDate={validateDate}
      />
    </Form.Item>
  );

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
            {renderDateTimePicker("registrationOpenDate", "Ngày mở đăng ký")}
            {renderDateTimePicker("registrationEndDate", "Ngày đóng đăng ký")}
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
                formatter={value => `${value}`.replace(/\D/g, '')} // Hiển thị chỉ số
                parser={value => value.replace(/\D/g, '')} // Phân tích chỉ số
              />
            </Form.Item>
            {renderDateTimePicker("activeDate", "Ngày hoạt động")}
            {renderDateTimePicker("endDate", "Ngày kết thúc")}
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
