import React, { useState, useEffect } from 'react';
import { Table, Input, Pagination, message, Tag, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getOrders, getFilteredOrders } from '../../../api/orderManagement'; // Import cả hai hàm API
import { getAccounts } from '../../../api/accountManagement';
import { getTypeEcommerce } from '../../../api/typeEcommerceApi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './ordersMng.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrdersMng = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [typeEcommerce, setTypeEcommerce] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTypeEcommerce, setSelectedTypeEcommerce] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts({});
        const { data } = response;
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        message.error('Không có dữ liệu tài khoản!');
      }
    };

    const fetchTypeEcommerce = async () => {
      try {
        const response = await getTypeEcommerce({});
        setTypeEcommerce(response.data);
      } catch (error) {
        console.error('Error fetching typeEcommerce:', error);
        message.error('Không có dữ liệu hình thức TMĐT!');
      }
    };

    fetchAccounts();
    fetchTypeEcommerce();
    fetchAllOrders(); // Fetch all orders initially
  }, []);

  useEffect(() => {
    if (selectedTypeEcommerce || dateRange.length > 0) {
      fetchFilteredOrders(currentPage);
    } else {
      fetchAllOrders(currentPage);
    }
  }, [selectedTypeEcommerce, dateRange, currentPage]);

  const fetchAllOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getOrders({ pageIndex: page, pageSize });
      const orders = response.data;

      const ordersWithDetails = orders.map(order => {
        const user = accounts.find(account => account.userId === order.userId);
        const ecommerceType = typeEcommerce.find(type => type.typeEcommerceId === order.typeEcommerceId);
        return { 
          ...order, 
          fullName: user ? user.fullName : 'N/A',
          typeEcommerceTitle: ecommerceType ? ecommerceType.title : 'N/A',
        };
      });

      setData(ordersWithDetails);
      if (orders.length < pageSize) {
        setTotalItems((page - 1) * pageSize + orders.length);
      } else {
        setTotalItems((page + 1) * pageSize);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredOrders = async (page = 1) => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const response = await getFilteredOrders({
        pageIndex: page,
        pageSize,
        typeEcommerceId: selectedTypeEcommerce,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      });
      const orders = response.data;

      const ordersWithDetails = orders.map(order => {
        const user = accounts.find(account => account.userId === order.userId);
        const ecommerceType = typeEcommerce.find(type => type.typeEcommerceId === order.typeEcommerceId);
        return { 
          ...order, 
          fullName: user ? user.fullName : 'N/A',
          typeEcommerceTitle: ecommerceType ? ecommerceType.title : 'N/A',
        };
      });

      setData(ordersWithDetails);
      if (orders.length < pageSize) {
        setTotalItems((page - 1) * pageSize + orders.length);
      } else {
        setTotalItems((page + 1) * pageSize);
      }
    } catch (error) {
      console.error('Failed to fetch filtered data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    navigate(`/staff/orders/${record.orderId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeEcommerceChange = (value) => {
    setSelectedTypeEcommerce(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || []);
  };

  const disabledDate = (current) => {
    if (!dateRange || dateRange.length === 0) {
      return false;
    }
    const [start] = dateRange;
    return current && current < start;
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'wrap-text',
    },
    {
      title: 'Tổng giá',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
    },
    {
      title: 'Hình thức',
      dataIndex: 'typeEcommerceTitle',
      key: 'typeEcommerceTitle',
    },
    {
      title: 'Ngày mua hàng',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Tình trạng vận chuyển',
      dataIndex: 'deliveryDescription',
      key: 'deliveryDescription',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let statusText = '';
        let color = '';
  
        switch (status) {
          case 1:
            statusText = 'Chờ xác nhận';
            color = 'red';
            break;
          case 2:
            statusText = 'Đang chuẩn bị hàng';
            color = 'yellow';
            break;
          case 3:
            statusText = 'Đang giao';
            color = 'blue';
            break;  
          case 4:
            statusText = 'Đã giao';
            color = 'green';
            break;  
          case 5:
            statusText = 'Đã hủy';
            color = 'grey';
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
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '20px' }}>
        {/* <Input
          placeholder="Tìm kiếm theo mã đơn hàng/ địa chỉ giao hàng"
          suffix={
            <SearchOutlined
              onClick={() => setCurrentPage(1)}
              style={{ cursor: 'pointer' }}
            />
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => setCurrentPage(1)}
          style={{ width: '30%' }}
        /> */}
        <Select
          placeholder="Chọn hình thức"
          onChange={handleTypeEcommerceChange}
          style={{ width: '20%' }}
          allowClear
        >
          <Option value={1}>Mua bán</Option>
          <Option value={2}>Cho thuê</Option>
          <Option value={3}>Đấu giá</Option>
        </Select>
        {/* <RangePicker
          onChange={handleDateRangeChange}
          style={{ width: '30%' }}
          disabledDate={disabledDate}
        /> */}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="orderId"
        loading={loading}
        className="orders-table"
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

export default OrdersMng;
