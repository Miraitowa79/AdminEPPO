import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, message, Select, Tag } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAuctions, getAuctionStatus } from '../../../api/auctionManagement';
import {getAuthUser} from '@src/utils'

const { Option } = Select;

const AuctionMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [selectedType, setSelectedType] = useState('');

  const fetchData = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      const response = status 
      ? await getAuctionStatus({ page, size: pageSize, search, status })
      : await getAuctions({ page, size: pageSize, search });
      const userId = getAuthUser().userId;
      const items = response.data;
      const filteredItems = items.filter(item => item.modificationBy == userId);
      setData(filteredItems);
      console.log("filtered data: ", filteredItems);

      if (filteredItems.length < pageSize) {
        setTotalItems((page - 1) * pageSize + filteredItems.length);
      } else {
        setTotalItems(page * pageSize);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error.response?.data || error.message);
      message.error('Không có dữ liệu');
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

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (record) => {
    navigate(`/staff/auction/${record.roomId}`);
  };

  const handleCreateRoom = () => {
    navigate('/staff/auction/create');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã phòng',
      dataIndex: 'roomId',
      key: 'roomId',
    },
    {
      title: 'Tên cây',
      dataIndex: ['plant', 'plantName'],
      key: 'plantName',
    },
    {
      title: 'Phí đăng ký',
      dataIndex: 'registrationFee',
      key: 'registrationFee',
      render: (fee) => fee.toLocaleString(),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'activeDate',
      key: 'activeDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Trạng thái đấu giá',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        let color = '';
  
        switch (status) {
          case 1:
            statusText = 'Chờ xác nhận';
            color = 'yellow';
            break;
          case 2:
            statusText = 'Đang hoạt động';
            color = 'blue';
            break;
          case 3:
            statusText = 'Đấu giá thành công';
            color = 'green';
            break;
          case 4:
            statusText = 'Đấu giá thất bại';
            color = 'red';
            break;
          case 5:
            statusText = 'Đã hủy';
            color = 'gray';
            break;
          default:
            statusText = 'Không xác định';
            color = 'black';
        }
  
        return <Tag color={color}>{statusText}</Tag>;
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        {/* <Input
          placeholder="Tìm kiếm phòng đấu giá"
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
        /> */}
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRoom}>
          Tạo phòng đấu giá
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Select
          placeholder="Chọn trạng thái đấu giá"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px', marginBottom: '20px' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="1">Chờ xác nhận</Option>
          <Option value="2">Đang hoạt động</Option>
          <Option value="3">Đấu giá thành công</Option>
          <Option value="4">Đấu giá thất bại</Option>
          <Option value="5">Đã hủy</Option>
        </Select>
      </div>
      
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="roomId"
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

export default AuctionMng;
