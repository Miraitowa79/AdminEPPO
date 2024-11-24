import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Spin, message, Avatar, Upload, DatePicker } from 'antd';
import { getPlantDetails ,updatePlant } from '../../../api/plantsManagement';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PlantSaleDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [extraForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlantDetails = async (id) => {
      try {
        const data = await getPlantDetails(id);
        setData(data.data);
        form.setFieldsValue(data.data);
      } catch (error) {
        console.error('Error fetching plant details:', error);
        message.error('Error fetching plant details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlantDetails(id);
    }
  }, [id, form]);


  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const updatedData = {
        ...data.plant,
        plantName: values.plantName,
        title: values.title,
        description: values.description,
        length: values.length,
        width: values.width,
        height: values.height,
        finalPrice: values.finalPrice,
        categoryId: values.categoryId,
        typeEcommerceId: values.typeEcommerceId,
        isActive: values.isActive,
        status: values.status,
        activeDate: values.activeDate.toISOString(),
        endDate: values.endDate.toISOString(),
        modificationDate: new Date().toISOString(),
        modificationBy: values.modificationBy,
     
      };
      await updatePlant(id, updatedData);
      message.success('Cập nhật thành công !');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to fetch data:', error.response?.data || error.message);
    }finally{
      setIsSubmitting(false);
    }
  };



  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    form.setFieldsValue(data);
  };

  const handleFinish = (updatedData) => {
    console.log('Updated data:', updatedData);
    setData(updatedData);
    setEditMode(false);
    message.success('Plant details updated successfully');
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Form chính bên trái */}
      <div style={{ flex: 4}}>
        <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT CÂY CẢNH</Title>
      <  Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button type="primary" shape="round">Mã cây: {data.plantId}</Button>
        </div>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
          onFinish={handleFinish}
        >
          <Form.Item label="Hình ảnh" name="imageUrl">
            <Avatar style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%', marginRight: '20px' }} src={data.imagePlants[0]?.imageUrl} />
            {editMode && (
              <Upload>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="Tên cây:" name="plantName">
            <Input readOnly={!editMode} />
          </Form.Item>

          <Form.Item label="Mô tả ngắn:" name="title">
            <Input readOnly={!editMode} />
          </Form.Item>

          <Form.Item label="Chi tiết:" name="description">
            <Input.TextArea readOnly={!editMode} />
          </Form.Item>

          <Form.Item label="Chiều dài:" name="length">
            <Input readOnly={!editMode} />
          </Form.Item>

          <Form.Item label="Chiều rộng:" name="width">
            <Input readOnly={!editMode} />
          </Form.Item>

          <Form.Item label="Chiều cao:" name="height">
            <Input readOnly={!editMode} />
          </Form.Item>
          <Form.Item label="Giá bán:" name="finalPrice">
            <Input readOnly={!editMode} />
          </Form.Item>


          <Form.Item label="Ngày tạo:" name="creationDate">
            <Input value={moment(data.creationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>

          <Form.Item label="Ngày kết thúc:" name="modificationDate">
            <Input value={moment(data.creationDate).format('YYYY-MM-DD')} readOnly />
          </Form.Item>


          
          <Form.Item label="Chức vụ">
              <span
                style={{
                  color: data.isActive === true
                    ? 'green'
                    : 'gray',
                  fontWeight: 'bold',
                }}
              >
                {data.isActive === true
                  ? 'Đang còn hàng'
                  : data.isActive === false
                  ? 'Đang trong trạng thái hoạt động'
                  : 'Không xác định'}
              </span>
            </Form.Item>









          <Form.Item label="Trạng thái:" name="status">
            <Input readOnly={!editMode} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            {editMode ? (
              <>
                <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelClick}>Hủy</Button>
                <Button type="primary" htmlType="submit">Lưu</Button>
              </>
            ) : (
              <Button type="primary" onClick={handleUpdateClick}>Cập nhật</Button>
            )}
          </Form.Item>
        </Form>
      </Card>
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>THÔNG TIN CÂY ĐẤU GIÁ</Title>
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={styles.label}><strong>Mã cây:</strong></td>
                
              </tr>
              <tr>
                <td style={styles.label}><strong>Tên cây:</strong></td>
             
              </tr>
              <tr>
                <td style={styles.label}><strong>Tiêu đề:</strong></td>
            
              </tr>
              <tr>
                <td style={styles.label}><strong>Mô tả:</strong></td>
               
              </tr>
             
           
      
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
const styles = {
  label: {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
  },
  value: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
};
export default PlantSaleDetails;
