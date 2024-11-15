import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Space, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getOrders } from '../../../api/orderManagement';
import { getAccounts } from '../../../api/accountManagement';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './ordersMng.scss';

const OrdersMng = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts({});
        const { data } = response;
        setAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        message.error('Error fetching accounts');
      }
    };

    fetchAccounts();
  }, []);

  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getOrders({ pageIndex: page, pageSize, search });
      const orders = response.data; // Giả định response có dạng { data: [...] }

      const ordersWithUserDetails = orders.map(order => {
        const user = accounts.find(account => account.userId === order.userId);
        return { ...order, userName: user ? user.userName : 'N/A' };
      });

      setData(ordersWithUserDetails);
      
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

  useEffect(() => {
    fetchData(currentPage, searchText);
  }, [currentPage, searchText, accounts]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText);
  };

  const handleViewDetails = (record) => {
    navigate(`/staff/orders/${record.orderId}`);
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
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      className: 'wrap-text',
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      className: 'wrap-text',
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
    },
    {
      title: 'Giá cuối cùng',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng/ địa chỉ giao hàng"
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
