import React, { useState, useEffect } from 'react';
import { Table, Input, Avatar, Button, Pagination } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import avatar from "../../../assets/images/team-2.jpg";
import { useNavigate } from 'react-router-dom';
import { getAccounts } from '../../../api/accountManagement';

const AccountMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getAccounts({ page, size: pageSize, search });
      const { data: items} = response;
      setData(items);
      
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
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText);
  };

  const handleViewDetails = (record) => {
    navigate(`/list/users/${record.userId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddAccount = () => {
    navigate('/admin/list/users/create-account'); // Chuyển hướng đến trang tạo tài khoản
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Avatar',
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
          onClick={handleAddAccount}
          style={{ marginLeft: '10px' }}
        >
          Thêm Tài Khoản
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="userId"
        loading={loading}
      />
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ textAlign: 'center', marginTop: '20px', justifyContent: 'right'}}
      />
    </div>
  );
};

export default AccountMng;
