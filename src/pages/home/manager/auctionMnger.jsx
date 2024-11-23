import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, message, Select } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAuctions } from '../../../api/auctionManagement';

const AuctionMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [selectedType, setSelectedType] = useState('');

  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getAuctions({ page, size: pageSize, search });
      const items = response.data;
      setData(items);

      if (items.length < pageSize) {
        setTotalItems((page - 1) * pageSize + items.length);
      } else {
        setTotalItems(page * pageSize);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchText,selectedType);
  }, [currentPage, searchText, selectedType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText,selectedType);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (record) => {
    navigate(`/manager/auction/${record.roomId}`);
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
      title: 'Trạng thái   đấu giá',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        switch (status) {
          case 1:
            return 'Chờ xác nhận';
          case 2:
            return 'Đang hoạt động';
          case 3:
            return 'Đấu giá thành công';
          case 4:
            return 'Đấu giá thất bại';
          case 5:
            return 'Đã hủy';
          default:
            return 'Không xác định';
        }
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
        <Input
          placeholder="Search by plant name"
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
          <Select
          placeholder="Chọn loại cây"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px', marginLeft: 'auto' }}
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
