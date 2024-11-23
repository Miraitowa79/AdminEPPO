import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Typography, Card, Spin, message, Select } from 'antd';
import { getContractDetails, updateContractDetails } from '../../../api/contractManagement';
import { getAccountDetails } from '../../../api/accountManagement';
import moment from 'moment';
import './../staff/orderDetailStaff.scss';

const { Title } = Typography;
const { Option } = Select;

const ContractDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: contractData } = await getContractDetails(id);
        setContract(contractData);

        console.log("Log",contractData.contractDetails);
        if (contractData.userId) {
          const { data: userData } = await getAccountDetails(contractData.userId);
          setUser(userData);
        }

        form.setFieldsValue({
          ...contractData,
          creationContractDate: moment(contractData.creationContractDate),
          endContractDate: moment(contractData.endContractDate),
        });
        console.log("Data",contractData)
      } catch (error) {
        console.error('Error fetching details:', error);
        message.error('Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, form]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    console.log('contract: ', contract)
    let cloneContract = {...contract}
    cloneContract.endContractDate = moment(contract?.endContractDate)
    cloneContract.creationContractDate = moment(contract?.creationContractDate)
    form.setFieldsValue(cloneContract);
  };

  const handleFinish = async (updatedData) => {
    try {
      const updatedContract = {
        ...contract,
        ...updatedData,
        endContractDate: updatedData.endContractDate.format('YYYY-MM-DD')
      };
      await updateContractDetails(id, updatedContract);
      setContract(updatedContract);
      setEditMode(false);
      message.success('Cập nhật hợp đồng thành công!');
    } catch (error) {
      message.error('Error updating contract details');
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1800px', margin: 'auto', display: 'flex', gap: '20px' }}>
    <div style={{ flex: 2 }}>
      <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT HỢP ĐỒNG</Title>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button type="primary" shape="round">Mã HĐ: {contract.contractId}</Button>
        </div>
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleFinish}>
          <Form.Item label="Số hợp đồng:" name="contractNumber">
            <Input readOnly={!editMode} />
          </Form.Item>
          <Form.Item label="Chủ hợp đồng:" className={editMode ? 'blurred-field' : ''}>
            <Input value={user.fullName || 'N/A'} readOnly />
          </Form.Item>
          <Form.Item label="Mô tả:" name="description">
            <Input readOnly={!editMode} />
          </Form.Item>
          <Form.Item label="Ngày tạo hợp đồng:" name="creationContractDate" className={editMode ? 'blurred-field' : ''}>
            <DatePicker showTime value={moment(contract?.creationContractDate).format('YYYY-MM-DD')} disabled />
          </Form.Item>
          <Form.Item label="Ngày kết thúc hợp đồng:" name="endContractDate">
            <DatePicker showTime value={moment(contract?.endContractDate).format('YYYY-MM-DD')} disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Tổng số tiền (VND):" name="totalAmount">
            <Input readOnly={!editMode} />
          </Form.Item>
          <Form.Item label="Trạng thái hợp đồng:" name="isActive">
            <Select disabled={!editMode}>
              <Option value={1}>Đã ký hợp đồng</Option>
              <Option value={0}>Chưa ký hợp đồng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Loại hợp đồng:" name="typeContract" className={editMode ? 'blurred-field' : ''}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Tệp hợp đồng:" className={editMode ? 'blurred-field' : ''}>
            <a href={contract.contractUrl} target="_blank" rel="noopener noreferrer">
              {contract.contractFileName}
            </a>
          </Form.Item>
          <Form.Item label="Trạng thái hợp đồng:" name="status">
            <Select disabled={!editMode}>
              <Option value={1}>Đang hoạt động</Option>
              <Option value={2}>Hết hạn hợp đồng</Option>
              <Option value={0}>Bị hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            {editMode ? (
              <>
                <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelClick}>Hủy</Button>
                <Button type="primary" htmlType="submit">Lưu</Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditClick}>Cập nhật</Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>


    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flex: 1, padding: '20px' }}>
    <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>THÔNG TIN CÂY CHO THUÊ</Title>
    <Card>
      {/* Plant Information Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={styles.label}><strong>Mã cây:</strong></td>
            <td style={styles.value}>{contract.contractNumber}</td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>

          {/* Other plant details */}
        </tbody>
      </table>
    </Card>
  </div>

  <div style={{ flex: 1, padding: '20px' }}>
    <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>THÔNG TIN CÂY ĐẤU GIÁ</Title>
    <Card>
      {/* Plant Information Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={styles.label}><strong>Mã cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>
          <tr>
            <td style={styles.label}><strong>Tên cây:</strong></td>
            <td style={styles.value}></td>
          </tr>

          {/* Other plant details */}
        </tbody>
      </table>
    </Card>
  </div>
</div>

  </div>
  );
};

export default ContractDetails;

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
