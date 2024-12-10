import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Typography, Card, Spin, message, Select, Modal } from 'antd';
import { getContractDetails, updateContractDetails, createContractWithUserId, createContract } from '../../../api/contractManagement';
import { getAccountDetails } from '../../../api/accountManagement';
import moment from 'moment';
import './orderDetailStaff.scss';

const { Title } = Typography;
const { Option } = Select;

const ContractDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [supplementaryContract, setSupplementaryContract] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: contractData } = await getContractDetails(id);
        setContract(contractData);

        if (contractData.userId) {
          const { data: userData } = await getAccountDetails(contractData.userId);
          setUser(userData);
        }

        form.setFieldsValue({
          ...contractData,
          creationContractDate: moment(contractData.creationContractDate),
          endContractDate: moment(contractData.endContractDate),
        });
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
    let cloneContract = { ...contract };
    cloneContract.endContractDate = moment(contract?.endContractDate);
    cloneContract.creationContractDate = moment(contract?.creationContractDate);
  
    form.setFieldsValue(cloneContract);
  };

  const handleFinish = async (updatedData) => {
    try {
      const updatedContract = {
        ...contract,
        ...updatedData,
        endContractDate: updatedData.endContractDate.format('YYYY-MM-DD'),
      };
      await updateContractDetails(id, updatedContract);
      setContract(updatedContract);
      setEditMode(false);
      message.success('Cập nhật hợp đồng thành công!');
    } catch (error) {
      message.error('Cập nhật không thành công!');
    }
  };

  const handleRenewal = () => {
    Modal.confirm({
      title: 'Gia hạn hợp đồng',
      content: 'Bạn muốn gia hạn hợp đồng này thêm 1 tháng?',
      okText: 'Gia hạn',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const newContract = {
            contractNumber: contract.contractNumber,
            description: `Gia hạn hợp đồng ${contract.contractId}`,
            creationContractDate: moment().format('YYYY-MM-DD'),
            endContractDate: moment(contract.endContractDate).add(1, 'month').format('YYYY-MM-DD'),
            totalAmount: contract.totalAmount,
            contractUrl: contract.contractUrl,
            contractDetails: contract.contractDetails,
          };

          console.log('check', newContract)
  
          const { contractId } = await createContract(newContract);
          const { data: supplementaryContractData } = await getContractDetails(contractId);
          setSupplementaryContract(supplementaryContractData);
          message.success('Gia hạn hợp đồng thành công!');
        } catch (error) {
          console.error('Error creating contract:', error);
          message.error('Có lỗi xảy ra khi gia hạn hợp đồng.');
        }
      },
    });
  };
  

  const handleExpireContract = async () => {
    try {
      const updatedContract = {
        ...contract,
        isActive: 2, // Hết hạn hợp đồng
      };
      await updateContractDetails(id, updatedContract);
      setContract(updatedContract);
      message.success('Hợp đồng đã được đánh dấu là hết hạn!');
    } catch (error) {
      console.error('Error expiring contract:', error);
      message.error('Có lỗi xảy ra khi đánh dấu hợp đồng là hết hạn.');
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  const isContractEndingToday = moment(contract.endContractDate).isSame(moment(), 'day');
  const canEdit = contract.isActive === 0 || contract.isActive === 1;

  return (
    <div style={{ padding: '20px', maxWidth: '1800px', margin: 'auto', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT HỢP ĐỒNG</Title>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Button type="primary" shape="round">Mã HĐ: {contract.contractId}</Button>
          </div>
          <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="left" onFinish={handleFinish}>
            <Form.Item label="Mã đơn hàng:" name="contractNumber">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Chủ hợp đồng:">
              <Input value={user.fullName || 'N/A'} readOnly />
            </Form.Item>
            <Form.Item label="Mô tả:" name="description">
              <Input readOnly={!canEdit || (contract.isActive === 1 && !editMode)} />
            </Form.Item>
            <Form.Item label="Ngày tạo hợp đồng:" name="creationContractDate">
              <DatePicker value={moment(contract?.creationContractDate)} disabled />
            </Form.Item>
            {contract.isActive === 1 && (
              <Form.Item label="Ngày kết thúc hợp đồng:" name="endContractDate">
                <DatePicker 
                  value={moment(contract?.endContractDate)} 
                  disabled={!editMode} 
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            )}
            <Form.Item label="Tổng số tiền (VND):" name="totalAmount">
              <Input
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                readOnly
              />
            </Form.Item>
            <Form.Item label="Trạng thái hợp đồng:" name="isActive">
              <Select disabled={!editMode || contract.isActive === 1}>
                <Option value={1}>Đã ký hợp đồng</Option>
                <Option value={0}>Chưa ký hợp đồng</Option>
                <Option value={2}>Hết hạn hợp đồng</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Loại hợp đồng:" name="typeContract">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Tệp hợp đồng:">
              <a href={contract.contractUrl} target="_blank" rel="noopener noreferrer">
                {contract.contractFileName ? contract.contractFileName : contract.contractUrl}
              </a>
            </Form.Item>
            <Form.Item label="Trạng thái hợp đồng:" name="status">
              <Select disabled={!editMode}>
                <Option value={1}>Đang hoạt động</Option>
                <Option value={2}>Hết hạn hợp đồng</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              {contract.status !== 2 && (
                <>
                  {isContractEndingToday ? (
                    <>
                      <Button type="default" style={{ backgroundColor: 'yellow', marginRight: '10px' }} onClick={handleRenewal}>Gia hạn</Button>
                      <Button type="default" danger onClick={handleExpireContract}>Hết hạn hợp đồng</Button>
                    </>
                  ) : (
                    <>
                      {editMode ? (
                        <>
                          <Button type="default" danger style={{ marginRight: '10px' }} onClick={handleCancelClick}>Hủy</Button>
                          <Button type="primary" htmlType="submit">Lưu</Button>
                        </>
                      ) : (
                        <>
                          {contract.isActive === 0 && (
                            <Button type="primary" onClick={handleEditClick}>Cập nhật</Button>
                          )}
                          {contract.isActive === 1 && (
                            <>
                              <Button type="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>Chỉnh sửa</Button>
                              <Button type="default" onClick={handleRenewal}>Gia hạn</Button>
  
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Form.Item>
          </Form>
        </Card>
        {supplementaryContract && (
          <Card style={{ marginTop: '20px' }}>
            <Title level={4}>Phụ lục hợp đồng</Title>
            <Form.Item label="Tệp phụ lục hợp đồng:">
              <a href={supplementaryContract.contractUrl} target="_blank" rel="noopener noreferrer">
                {supplementaryContract.contractFileName ? supplementaryContract.contractFileName : supplementaryContract.contractUrl}
              </a>
            </Form.Item>
          </Card>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: '20px' }}>THÔNG TIN CÂY CHO THUÊ</Title>
          <Card>
            <table style={styles.table}>
              <tbody>
                {contract.contractDetails?.map((detail, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td style={styles.label}><strong>Mã cây:</strong></td>
                      <td style={styles.value}>{detail.plantId}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Tiêu đề:</strong></td>
                      <td style={styles.value}>{detail.plant?.title}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Tên cây:</strong></td>
                      <td style={styles.value}>{detail.plant?.plantName}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Mô tả:</strong></td>
                      <td style={styles.value}>{detail.plant?.description}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Chiều dài:</strong></td>
                      <td style={styles.value}>{detail.plant?.length}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Chiều rộng:</strong></td>
                      <td style={styles.value}>{detail.plant?.width}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Chiều cao:</strong></td>
                      <td style={styles.value}>{detail.plant?.height}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Giá:</strong></td>
                      <td style={styles.value}>{detail.plant?.finalPrice}</td>
                    </tr>
                    <tr>
                      <td style={styles.label}><strong>Chi tiết sản phẩm:</strong></td>
                      <td style={styles.value}>
                        <img src={detail.plant?.mainImage} alt={detail.plant?.plantName} style={styles.image} />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>THÔNG TIN NGƯỜI THUÊ</Title>
          <Card>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.label}><strong>Họ và tên:</strong></td>
                  <td style={styles.value}>{user.fullName}</td>
                </tr>
                <tr>
                  <td style={styles.label}><strong>Email:</strong></td>
                  <td style={styles.value}>{user.email}</td>
                </tr>
                <tr>
                  <td style={styles.label}><strong>Hình ảnh:</strong></td>
                  <td style={styles.value}>
                    <img src={user.imageUrl} alt={user.fullName} style={styles.image} />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};


const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px 0',
  },
  label: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    width: '150px',
  },
  value: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  image: {
    width: '100px',
    height: 'auto',
  },
};

export default ContractDetails;
