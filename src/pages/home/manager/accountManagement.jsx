import React, { useState, useEffect } from 'react';
import { Table, Input, Avatar, Button, Pagination, Select } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import avatar from "../../../assets/images/team-2.jpg";
import { useNavigate } from 'react-router-dom';
import { getAccounts, getAccountsStatus } from '../../../api/accountManagement';

const AccountMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const pageSize = 10;
  const { Option } = Select;

  const fetchData = async (page = 1, search = '', roleId = '') => {
    setLoading(true);
    try {
      const response = roleId
        ? await getAccountsStatus({ page, size: pageSize, search, roleId }) // Corrected roleId mapping
        : await getAccounts({ page, size: pageSize, search });

      const { data: items } = response;

      setData(items);

      if (items.length < pageSize) {
        setTotalItems((page - 1) * pageSize + items.length);
      } else {
        setTotalItems((page + 1) * pageSize);
      }
      // setTotalItems(response.total || items.length); // Adjusted totalItems logic
    } catch (error) {
      console.error('Failed to fetch data:', error.response?.data || error.message);
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
    navigate(`/list/users/${record.userId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleAddAccount = () => {
    navigate('/admin/list/users/create-account');
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
      render: (imageUrl) => <Avatar src={imageUrl || avatar} />,
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
      title: 'Ngày Tạo',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN');  // Định dạng theo chuẩn Việt Nam
        return formattedDate;
      },
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        let statusColor = '';
    
        switch (status) {
          case 1:
            statusText = 'Đang hoạt động';
            statusColor = 'green';  // Màu xanh cho "Đang hoạt động"
            break;
          case 2:
            statusText = 'Ngừng hoạt động';
            statusColor = 'red';  // Màu đỏ cho "Ngừng hoạt động"
            break;
          default:
            statusText = 'Không rõ';
            statusColor = 'gray';  // Màu xám cho "Không rõ"
            break;
        }
    
        return (
          <span style={{ color: statusColor }}>
            {statusText}
          </span>
        );
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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Select
          placeholder="Chọn loại tài khoản"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: "200px", marginLeft: "auto" }}
        >
          <Option value="">Tất cả</Option>
          <Option value="3">Nhân viên</Option>
          <Option value="5">Khách hàng</Option>
          <Option value="4">Người bán</Option>
        </Select>
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
        style={{ textAlign: 'center', marginTop: '20px', justifyContent: 'right' }}
      />
    </div>
  );
};

export default AccountMng;
