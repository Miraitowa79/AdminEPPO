import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { apiContract } from '../../api/apiConfig'; 

const ContractMng = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [searchText, setSearchText] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 10; 

    //Get API Contracts
  const fetchData = async (page = 1, search = '') => {
    setLoading(true); 
    try {
      const response = await axios.get(apiContract.getListContract, {
        params: {
          page: page,
          size: pageSize,
          search: search
        }
      });
      const { data: items, total } = response.data; 
      setData(items.map((item, index) => ({
        ...item,
        key: item.contractId, 
        userId: item.user.userName, 
        totalAmount: item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }), // Format amount in VND
        creationContractDate: item.creationContractDate.split('T')[0], 
        endContractDate: item.endContractDate.split('T')[0], 
        status: item.status === 1 ? 'Đang hoạt động' : 'Hết hạn', 
      })));
      setTotalItems(response.data.total);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  const handleSearch = () => {
    setCurrentPage(1); 
    fetchData(1, searchText); 
  };
  const handleViewDetails = (record) => {
    console.log('View details:', record);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page); 
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
      title: 'Chủ hợp đồng',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Ngày kí',
      dataIndex: 'creationContractDate',
      key: 'creationContractDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endContractDate',
      key: 'endContractDate',
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
        style={{ marginBottom: '20px', width: '50%' }}
      />
        <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        loading={loading}
      />
       <Pagination
        defaultCurrent={1}
        total={100}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      />
      {/* <Table columns={columns} dataSource={data} pagination={false} /> */}
      {/* <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      /> */}
    </div>
  );
};

export default ContractMng;
