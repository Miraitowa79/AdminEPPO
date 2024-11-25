import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Select, Tag } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getContracts, getContractStatus } from '../../../api/contractManagement';
import './contractManagement.scss';

const { Option } = Select;

const ContractMng = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchData = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      const response = status
        ? await getContractStatus({ page, size: pageSize, search, status })
        : await getContracts({ page, size: pageSize, search });
      const { data: items } = response;

      setData(items.map((item, index) => ({
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
    fetchData(currentPage, searchText, selectedType);
  }, [currentPage, searchText, selectedType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText, selectedType);
  };

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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Mã hợp đồng',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Mã đơn hàng',
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
        <Input
          placeholder="Tìm kiếm theo họ và tên/ mã hợp đồng"
          suffix={
            <SearchOutlined
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            />
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: '50%' }}
        />
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
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        loading={loading}
        rowClassName={rowClassName} // Apply the row class name
      />
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
