import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Radio, Button, DatePicker, TimePicker, Modal, Avatar, Row, Col } from 'antd';
import avatar from "../../assets/images/team-2.jpg";

const { TextArea } = Input;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState({ email: '', password: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email') || 'abc123@gmail.com';
    const password = localStorage.getItem('password') || '**************';
    setAccountInfo({ email, password });
  }, []);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Logic để lưu thay đổi
    setIsEditing(false);
  };

  const handleCancelClick = () => {
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Card style={{ width: '60%', marginRight: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Thông tin nhân viên</h2>
        <Form
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          <Form.Item label="Hình ảnh">
            <Avatar style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%' }} src={avatar}/>
          </Form.Item>
          <Form.Item label="Họ và Tên">
            <Input placeholder="Nguyen Van A" disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Giới Tính">
            <Row gutter={8}>
              <Col span={12}>
                <Radio.Group disabled={!isEditing}>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Col>
              <Col span={12}>
                <Form.Item label="Số điện thoại" style={{ marginBottom: 0 }}>
                  <Input placeholder="0912345678" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <Row gutter={8}>
              <Col span={8}>
                <DatePicker style={{ width: 'auto' }} disabled={!isEditing} />
              </Col>
              <Col span={6}>
                <TimePicker style={{ width: 'auto' }} disabled={!isEditing} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Email">
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="abc123@gmail.com" disabled={!isEditing} />
              </Col>
              <Col span={12}>
                <Form.Item label="CCCD/CMND" style={{ marginBottom: 0 }}>
                  <Input placeholder="0000000000" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <TextArea placeholder="abc123, quận 9, TP. Hồ Chí Minh" disabled={!isEditing} />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Input placeholder="Chờ xác nhận" disabled={!isEditing} style={{ width: 'auto' }} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSaveClick} style={{ width: '48%', marginRight: '4%', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>
                  Lưu thay đổi
                </Button>
                <Button onClick={handleCancelClick} style={{ width: '48%' }}>
                  Hủy
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleUpdateClick} style={{ width: '100%', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>
                Cập nhật
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
      <div style={{ width: '30%' }}>
        <Card style={{ marginBottom: '20px' }}>
          <h3>Tài khoản</h3>
          <Form layout="vertical">
            <Form.Item label="Tài khoản">
              <Input value={accountInfo.email} disabled />
            </Form.Item>
            <Form.Item label="Mật khẩu">
              <Input.Password value={accountInfo.password} disabled />
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
