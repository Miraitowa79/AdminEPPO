import React, { useState, useEffect } from 'react';
import { Table, Input, Avatar, Button, Pagination } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import avatar from "../../assets/images/team-2.jpg";
import axios from 'axios';
import { apiAccount } from '../../api/apiConfig'; 

const accountMng = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [searchText, setSearchText] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 10; 

  //Get API Accounts
  const fetchData = async (page = 1, search = '') => {
    setLoading(true); 
    try {
      const response = await axios.get(apiAccount.getListAccount, {
        params: {
          page: page,
          size: pageSize,
          search: search
        }
      });
      const { data: items } = response.data; 
      setData(items);
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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1, 
    },
    {
      title: 'Avata',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => <Avatar src={imageUrl ? imageUrl : avatar} />, 
    },
    {
      title: 'Họ Và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        switch (status) {
          case 1:
            return 'Đang hoạt động';
          case 2:
            return 'Hoạt động hạn chế';
          case 3:
            return 'Ngừng hoạt động';
          default:
            return 'Không rõ';
        }
      },
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

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
       {/* <Table columns={columns} dataSource={data} pagination={false} /> */}
       <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="userId"
        loading={loading}
      />
      {/* <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px' }}
      /> */}
      <Pagination
        defaultCurrent={1}
        total={100}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      />
    </div>
  );
};

export default accountMng;
