import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, message } from 'antd';
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
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText);
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
    // {
    //   title: 'Plant ID',
    //   dataIndex: 'plantId',
    //   key: 'plantId',
    // },
    {
      title: 'Tên cây',
      dataIndex: ['plant', 'plantName'],
      key: 'plantName',
    },
    // {
    //   title: 'Registration Open Date',
    //   dataIndex: 'registrationOpenDate',
    //   key: 'registrationOpenDate',
    //   render: (date) => new Date(date).toLocaleDateString(),
    // },
    // {
    //   title: 'Registration End Date',
    //   dataIndex: 'registrationEndDate',
    //   key: 'registrationEndDate',
    //   render: (date) => new Date(date).toLocaleDateString(),
    // },
    {
      title: 'Phí đăng ký',
      dataIndex: 'registrationFee',
      key: 'registrationFee',
      render: (fee) => fee.toLocaleString(),
    },
    // {
    //   title: 'Price Step',
    //   dataIndex: 'priceStep',
    //   key: 'priceStep',
    //   render: (step) => step.toLocaleString(),
    // },
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
    // {
    //   title: 'Modification Date',
    //   dataIndex: 'modificationDate',
    //   key: 'modificationDate',
    //   render: (date) => new Date(date).toLocaleDateString(),
    // },
    {
      title: 'Modification By',
      dataIndex: 'modificationBy',
      key: 'modificationBy',
    },
    {
      title: 'Trạng thái cuộc đấu giá',
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRoom}>
          Tạo phòng đấu giá
        </Button>
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
