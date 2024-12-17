import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Tag, Tabs, Input } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getContracts, getContractStatus } from '../../../api/contractManagement';
import moment from 'moment';
import './contractManagement.scss';

const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const ContractMng = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 1000;
  const navigate = useNavigate();

  const fetchData = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const response = status
        ? await getContractStatus({ page, size: pageSize, status })
        : await getContracts({ page, size: pageSize });

      const { data: items } = response;
      console.log('data:', response);

      setData(items.filter(item => item.isAddendum === (activeTab === 'addendum')).map((item, index) => ({
        ...item,
        key: item.contractId,
        userId: item.user.fullName,
        totalAmount: item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        creationContractDate: moment(item.creationContractDate).format('DD-MM-YYYY'),
        endContractDate: moment(item.endContractDate).format('DD-MM-YYYY'),
        status: item.status === 1 ? 'Đang hoạt động' : 'Hết hạn',
      })));

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
    fetchData(currentPage, selectedType);
  }, [currentPage, selectedType, activeTab]);

  const handleViewDetails = (record) => {
    navigate(`/staff/contract/${record.contractId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = data.filter(item => 
    String(item.contractId).toLowerCase().includes(searchQuery) ||
    String(item.contractNumber).toLowerCase().includes(searchQuery) ||
    String(item.userId).toLowerCase().includes(searchQuery)
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Mã HĐ',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: 'Chủ hợp đồng',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Mã ĐH',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'creationContractDate',
      key: 'creationContractDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endContractDate',
      key: 'endContractDate',
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'typeContract',
      key: 'typeContract',
    },
    {
      title: 'Hiệu lực hoạt động',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'gray';
        if (text === 'Đang hoạt động') color = 'green';
        else if (text === 'Hết hạn') color = 'red';
    
        return <Tag color={color}>{text}</Tag>;
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

  const rowClassName = (record) => {
    const today = moment();
    const endDate = moment(record.endContractDate, 'DD-MM-YYYY');
    
    return (endDate.isSameOrBefore(today) && record.status === 'Đang hoạt động') ? 'red-row' : '';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Input
          placeholder="Tìm kiếm theo mã HĐ, mã ĐH, hoặc chủ hợp đồng"
          onChange={handleSearchChange}
          style={{ width: 400, marginRight: '20px' }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/staff/contract/create')}
        >
          Tạo hợp đồng mới
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Select
          placeholder="Chọn trạng thái"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="1">Đang hoạt động</Option>
          <Option value="2">Hết hạn</Option>
        </Select>
      </div>
      <Tabs defaultActiveKey="main" onChange={handleTabChange}>
        <TabPane tab="Hợp đồng chính" key="main">
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
        <TabPane tab="Phụ lục" key="addendum">
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ContractMng;
