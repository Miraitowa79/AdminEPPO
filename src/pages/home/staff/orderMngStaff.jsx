import React, { useState, useEffect } from 'react';
import { Table, Input, Pagination, message, Tag, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { getOrders, getFilteredOrders } from '../../../api/orderManagement'; // Import cả hai hàm API
import { getAccounts } from '../../../api/accountManagement';
import { getTypeEcommerce } from '../../../api/typeEcommerceApi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './ordersMng.scss';
import { render } from 'react-dom';

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
  const pageSize = 1000;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts({});
        setAccounts(response.data);
        console.log("acc list:", accounts)
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
        const user = accounts.find(account => account.userId == order.userId);
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
      message.error('Không có dữ liệu');
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
      title: 'Mã ĐH',
      dataIndex: 'orderId',
      key: 'orderId',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm mã đơn hàng"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
          </Button>
          <Button onClick={() => clearFilters()} icon={<ReloadOutlined />} size="small" style={{ width: 90 }}>
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.orderId.toString().toLowerCase().includes(value.toLowerCase()),
    },
    // {
    //   title: 'Khách hàng',
    //   dataIndex: 'fullName',
    //   key: 'fullName',
    //   className: 'wrap-text',
    //   render: (fullName, record) => {
    //     console.log("fullname:", fullName)
    //     console.log("rec: ", record)
    //     return (<>{fullName}</>)
    //   }
    // },
    {
      title: 'Tổng giá',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      filters: [
        { text: '< 1,000,000', value: 'low' },
        { text: '1,000,000 - 5,000,000', value: 'medium' },
        { text: '> 5,000,000', value: 'high' },
      ],
      onFilter: (value, record) => {
        if (value === 'low') return record.finalPrice < 1000000;
        if (value === 'medium') return record.finalPrice >= 1000000 && record.finalPrice <= 5000000;
        if (value === 'high') return record.finalPrice > 5000000;
        return true;
      },
    },
    {
      title: 'Hình thức',
      dataIndex: 'typeEcommerceId',
      key: 'typeEcommerceId',
      filters: [
        { text: 'Mua bán', value: 1 },
        { text: 'Cho thuê', value: 2 },
        { text: 'Đấu giá', value: 3 },
      ],
      onFilter: (value, record) => record.typeEcommerceId === value,
      render: (typeEcommerceId) => {
        switch (typeEcommerceId) {
          case 1:
            return 'Mua bán';
          case 2:
            return 'Cho thuê';
          case 3:
            return 'Đấu giá';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'Ngày mua hàng',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text) => moment(text).format('DD-MM-YYYY'),
      // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      //   <div style={{ padding: 8 }}>
      //     <RangePicker
      //       onChange={(dates) => {
      //         setSelectedKeys(dates ? [dates] : []);
      //       }}
      //       style={{ marginBottom: 8, display: 'block' }}
      //     />
      //     <Button
      //       type="primary"
      //       onClick={() => confirm()}
      //       icon={<SearchOutlined />}
      //       size="small"
      //       style={{ width: 90, marginRight: 8 }}
      //     >
      //       Search
      //     </Button>
      //     <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
      //       Reset
      //     </Button>
      //   </div>
      // ),
      // onFilter: (value, record) => {
      //   const [start, end] = value;
      //   const creationDate = moment(record.creationDate);
      //   return creationDate.isBetween(start, end, 'days', '[]');
      // },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      filters: [
        { text: 'Đã thanh toán', value: 'Đã thanh toán' },
        { text: 'Chưa thanh toán', value: 'Chưa thanh toán' },
      ],
      onFilter: (value, record) => record.paymentStatus.includes(value),
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
      filters: [
        { text: 'Chờ xác nhận', value: 1 },
        { text: 'Đang chuẩn bị hàng', value: 2 },
        { text: 'Đang giao', value: 3 },
        { text: 'Đã giao', value: 4 },
        { text: 'Đã hủy', value: 5 },
        { text: 'Thu hồi', value: 6 },
      ],
      onFilter: (value, record) => record.status === value,
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
          case 6:
            statusText = 'Thu hồi';
            color = 'purple';
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
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10, onChange: handlePageChange }}
        rowKey="orderId"
        loading={loading}
        className="orders-table"
      />
    </div>
  );  
};

export default OrdersMng;
