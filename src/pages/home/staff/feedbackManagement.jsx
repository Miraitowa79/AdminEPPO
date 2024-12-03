import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Tag, Rate, Select } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getFeedbacks } from '../../../api/feedbackManagement';

const { Option } = Select;

const FeedbackMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const pageSize = 5;

  const fetchData = async (page = 1, search = '', rating = '', status = '') => {
    setLoading(true);
    try {
      const response = await getFeedbacks({ page, size: pageSize, search, rating, status });
      const items = response.data;
      
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
    fetchData(currentPage, searchText, ratingFilter, statusFilter);
  }, [currentPage, searchText, ratingFilter, statusFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText, ratingFilter, statusFilter);
  };

  const handleRatingFilterChange = (value) => {
    setRatingFilter(value);
    setCurrentPage(1);
    fetchData(1, searchText, value, statusFilter);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchData(1, searchText, ratingFilter, value);
  };

  const handleViewDetails = (record) => {
    navigate(`/staff/feedback/${record.feedbackId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStarColor = (rating) => {
    if (rating === 1) return 'red';
    if (rating === 2 || rating === 3) return 'orange';
    return 'gold';
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Tên cây',
      dataIndex: ['plant', 'plantName'],
      key: 'plantName',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Rate
          disabled
          value={rating}
          count={5}
          style={{ color: getStarColor(rating) }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        let color = '';
  
        switch (status) {
          case 1:
            statusText = 'Đang xử lý';
            color = 'yellow';
            break;
          case 2:
            statusText = 'Đã phản hồi';
            color = 'green';
            break;
          // case 3:
          //   statusText = 'Đã phản hồi';
          //   color = 'green';
          //   break;  
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
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        {/* <Input
          placeholder="Search by title or description"
          suffix={
            <SearchOutlined
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            />
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: '30%' }}
        /> */}
        {/* <Select
          placeholder="Chọn đánh giá"
          value={ratingFilter}
          onChange={handleRatingFilterChange}
          style={{ width: '15%' }}
        >
          <Option value="">Tất cả đánh giá</Option>
          <Option value="1">1 sao</Option>
          <Option value="2">2 sao</Option>
          <Option value="3">3 sao</Option>
          <Option value="4">4 sao</Option>
          <Option value="5">5 sao</Option>
        </Select>
        <Select
          placeholder="Chọn trạng thái phản hồi"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          style={{ width: '15%' }}
        >
          <Option value="">Tất cả trạng thái</Option>
          <Option value="1">Chờ xác nhận</Option>
          <Option value="2">Đang xử lý</Option>
          <Option value="3">Đã phản hồi</Option>
        </Select> */}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="feedbackId"
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

export default FeedbackMng;
