import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, message, Select, Tag, DatePicker, Space, InputNumber } from 'antd';
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

  const [creationDateRange, setCreationDateRange] = useState([null, null]);
  const [activeDateRange, setActiveDateRange] = useState([null, null]);
  const [endDateRange, setEndDateRange] = useState([null, null]);

  const [minFee, setMinFee] = useState(null);
  const [maxFee, setMaxFee] = useState(null);

  const pageSize = 1000;
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

  const isDateInRange = (date, range) => {
    if (!range[0] || !range[1]) return true;
    const momentDate = moment(date);
    return momentDate.isSameOrAfter(range[0], 'day') && momentDate.isSameOrBefore(range[1], 'day');
  };  

  useEffect(() => {
    fetchData(currentPage, searchText, selectedType);
  }, [currentPage, searchText, selectedType]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const searchString = searchText.toLowerCase();
    return (
      String(item.roomId).toLowerCase().includes(searchString) ||
      String(item.plantName).toLowerCase().includes(searchString)
    );
  });

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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Space>
            <InputNumber
              placeholder="Min"
              value={selectedKeys[0]?.[0] || minFee}
              onChange={(value) => {
                const max = selectedKeys[0]?.[1];
                setSelectedKeys(value !== null ? [[value, max]] : []);
                setMinFee(value);
              }}
              style={{ marginBottom: 8, width: 100 }}
            />
            <InputNumber
              placeholder="Max"
              value={selectedKeys[0]?.[1] || maxFee}
              onChange={(value) => {
                const min = selectedKeys[0]?.[0];
                setSelectedKeys(value !== null ? [[min, value]] : []);
                setMaxFee(value);
              }}
              style={{ marginBottom: 8, width: 100 }}
            />
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setMinFee(null);
                setMaxFee(null);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const [min, max] = value;
        if (min !== null && record.registrationFee < min) return false;
        if (max !== null && record.registrationFee > max) return false;
        return true;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date) => new Date(date).toLocaleDateString(),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            value={selectedKeys[0] || creationDateRange}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
              setCreationDateRange(dates);
            }}
            format="DD/MM/YYYY"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setCreationDateRange([null, null]);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => isDateInRange(record.creationDate, creationDateRange),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'activeDate',
      key: 'activeDate',
      render: (date) => new Date(date).toLocaleDateString(),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            value={selectedKeys[0] || activeDateRange}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
              setActiveDateRange(dates);
            }}
            format="DD/MM/YYYY"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setActiveDateRange([null, null]);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => isDateInRange(record.activeDate, activeDateRange),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            value={selectedKeys[0] || endDateRange}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
              setEndDateRange(dates);
            }}
            format="DD/MM/YYYY"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setEndDateRange([null, null]);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => isDateInRange(record.endDate, endDateRange),
    },
    {
      title: 'Trạng thái đấu giá',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xác nhận', value: 1 },
        { text: 'Đang hoạt động', value: 2 },
        { text: 'Đấu giá thành công', value: 3 },
        { text: 'Đấu giá thất bại', value: 4 },
        { text: 'Đã hủy', value: 5 },
      ],
      onFilter: (value, record) => record.status === value,
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
        <Space>
          <Input
            placeholder="Tìm kiếm theo mã phòng hoặc tên cây đấu giá"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 400 }}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRoom}>
          Tạo phòng đấu giá
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        rowKey="roomId"
        loading={loading}
      />
    </div>
  );
};

export default AuctionMng;
