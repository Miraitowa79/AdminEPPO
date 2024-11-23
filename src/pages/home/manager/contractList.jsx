import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Select } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiContract } from '../../../api/apiConfig'; 
import { getContracts } from '../../../api/contractManagement';


const ContractMng = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [searchText, setSearchText] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const pageSize = 10; 
  const navigate = useNavigate();

// fetch get data
  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getContracts({ page, size: pageSize, search });
      const { data: items } = response;

      setData(items.map((item, index) => ({
        ...item,
        key: item.contractId,
        userId: item.user.userName,
        totalAmount: item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        creationContractDate: item.creationContractDate.split('T')[0],
        endContractDate: item.endContractDate.split('T')[0],
        // isActive: item.isActive === 1 ? 'Đã chấp nhận hợp đồng' : 'Chờ xét duyệt hợp đồng',
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
  // user Effect
  useEffect(() => {
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  // Search value
  const handleSearch = () => {
    setCurrentPage(1); 
    fetchData(1, searchText); 
  };

  // Detail Contract
  const handleViewDetails = (record) => {
    navigate(`/manager/contract/${record.contractId}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page); 
  };
  const handleTypeChange = (value) => {
    setSelectedType(value);
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
    // {
    //   title: 'Chủ hợp đồng',
    //   dataIndex: 'userId',
    //   key: 'userId',
    // },
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
    },
    {
      title: 'Xem chi tiết',
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

  return (
    <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Input
          placeholder="Tìm kiếm theo mã sản phẩm/ tên sản phẩm"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Select
          placeholder="Chọn loại cây"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px', marginLeft: 'auto' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="Hợp đồng chưa ký">Hợp đồng chưa ký</Option>
          <Option value="Hợp đồng đã ký">Hợp đồng đã ký </Option>
          <Option value="Hợp đồng hét hạn">Hợp đồng hết hạn</Option>
          <Option value="Hợp đồng đã hủy">Hợp đồng đã hủy</Option>  
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        loading={loading}
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
