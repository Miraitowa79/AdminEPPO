import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Select, Tag, Tabs } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getContracts, getContractStatus } from '../../../api/contractManagement';
import './contractManagement.scss';

const { Option } = Select;
const { TabPane } = Tabs;

const ContractMng = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1, status = '') => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'main') {
        response = await getContracts({ page, size: pageSize });
      } else {
        response = await getContractStatus({ page, size: pageSize, status });
      }

      const { data: items } = response;

      setData(items.filter(item => item.isAddendum === (activeTab === 'addendum')).map((item, index) => ({
        ...item,
        key: item.contractId,
        userId: item.user.userName,
        totalAmount: item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        creationContractDate: item.creationContractDate.split('T')[0],
        endContractDate: item.endContractDate.split('T')[0],
        status: item.status === 1 ? 'Đang hoạt động' : 'Hết hạn',
      })));

      if (items.length < pageSize) {
        setTotalItems((page - 1) * pageSize + items.length);
      } else {
        setTotalItems((page + 1) * pageSize);
      }
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, selectedType);
  }, [currentPage, selectedType, activeTab]);

  const handleViewDetails = (record) => {
    navigate(`/staff/contract/${record.contractId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Mã HĐ',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: 'Chủ hợp đồng',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: 'Số tiền',
    //   dataIndex: 'totalAmount',
    //   key: 'totalAmount',
    // },
    {
      title: 'Mã ĐH',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationContractDate',
      key: 'creationContractDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endContractDate',
      key: 'endContractDate',
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'typeContract',
      key: 'typeContract',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'gray';
        if (text === 'Đang hoạt động') color = 'green';
        else if (text === 'Hết hạn') color = 'red';
    
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Xem',
      key: 'action',
      render: (text, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  // Function to determine row class
  const rowClassName = (record) => {
    return (record.creationContractDate === record.endContractDate && record.status === 'Đang hoạt động') ? 'red-row' : '';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/staff/contract/create')}
        >
          Tạo hợp đồng mới
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Select
          placeholder="Chọn trạng thái"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="1">Đang hoạt động</Option>
          <Option value="2">Hết hạn</Option>
        </Select>
      </div>
      <Tabs defaultActiveKey="main" onChange={handleTabChange}>
        <TabPane tab="Hợp đồng chính" key="main">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
        <TabPane tab="Phụ lục" key="addendum">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
      </Tabs>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ textAlign: 'center', marginTop: '20px', justifyContent: 'right' }}
      />
    </div>
  );
};

export default ContractMng;
