import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Radio, Button, DatePicker, TimePicker, Modal, Avatar, Row, Col } from 'antd';
import avatar from "../../assets/images/team-2.jpg";
import {getAuthUser} from '@utils';
import moment from 'moment';

const { TextArea } = Input;
const {useForm} = Form;
const Profile = () => {
  const user = getAuthUser();
  console.log("acc: ", user)
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [account, setAccount] = useState(user);
  const [form] = useForm();



  const handleCancelClick = () => {
    form.resetFields();
    // Logic để hủy thay đổi
    setIsEditing(false);
    
  };

  const handlePasswordChangeClick = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    // Xử lý logic đổi mật khẩu ở đây
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  
  const handleSubmitForm = (values) => {
    if(isEditing){
      console.log('check values', values)
    }
    setIsEditing(pre => !pre)
  }
  console.log('check isEdit', isEditing)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Card style={{ width: '60%', marginRight: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Thông tin nhân viên</h2>
        <Form
          form={form}
          name="profile"
          onFinish={handleSubmitForm}
          initialValues={{
            name: user.fullName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            birthDate: moment(user.dateOfBirth || '1/1/1990 12:00:00 AM', "MM/DD/YYYY h:mm:ss A"),
            idNumber: user.identificationCard,
            address: user.address,
            status: user.status,
          }}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          <Form.Item label="Hình ảnh">
            <Avatar style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%' }} src={avatar} />
          </Form.Item>
          <Form.Item name="name" label="Họ và Tên">
            <Input disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Giới Tính">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="gender" noStyle>
                  <Radio.Group disabled={!isEditing}>
                    <Radio value="Male">Nam</Radio>
                    <Radio value="Female">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phoneNumber" label="Số điện thoại" style={{ marginBottom: 0 }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="birthDate" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Email">
            <Row gutter={8}>
              <Col span={12}>
                <Input value={user.email || ''} disabled />
              </Col>
              <Col span={12}>
                <Form.Item name="idNumber" label="CCCD/CMND" style={{ marginBottom: 0 }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <TextArea placeholder="abc123, quận 9, TP. Hồ Chí M*****" disabled={!isEditing} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Input disabled={!isEditing} style={{ width: '100%' }} />
          </Form.Item>
          <Row>
            <Col span={24}>
                <Button type="primary" htmlType="submit" style={{ width: isEditing ?  '48%' : '100%', marginRight: '4%', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>
                  {isEditing ? 'Lưu thay đổi' :  'Cập nhật'}
                </Button>
                {isEditing && (
                  <Button onClick={handleCancelClick} style={{ width: '48%' }}>
                    Hủy
                </Button>
                )}
            </Col>
          </Row>
        </Form>
      </Card>
      <div style={{ width: '30%' }}>
        <Card style={{ marginBottom: '20px' }}>
          <h3>Tài khoản</h3>
          <Form layout="vertical">
            <Form.Item label="Tài khoản">
              <Input value={user.email} disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handlePasswordChangeClick} style={{ width: '100%', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <h3>Ngày làm việc</h3>
          {/* Content for working days */}
        </Card>
      </div>
      <Modal title="Đổi mật khẩu" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
        <Form layout="vertical">
          <Form.Item label="Mật khẩu cũ">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Mật khẩu mới">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu mới">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
