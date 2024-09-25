import React, { useState } from 'react';
import { Table, Input, Button, Pagination, Space, Select } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const data = [
  {
    key: '1',
    code: 'PT1232',
    name: 'Cây kim tiền',
    price: '5.000.000',
    description: 'Cây kim tiền...',
    businessModel: 'Cây bán',
    status: 'Đang bán',
    category: 'Cây phong thủy',
  },
  {
    key: '2',
    code: 'PT2232',
    name: 'Cây mai 10 cánh',
    price: '5.000.000',
    description: 'Cây mai 10 cánh...',
    businessModel: 'Cây cho thuê',
    status: 'Đang cho thuê',
    category: 'Cây cảnh',
  },
];

const PlantsMng = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = () => {
    console.log('Search:', searchText);
  };

  const handleViewDetails = (record) => {
    console.log('View details:', record);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const filteredData = data.filter(item => 
    (item.code.includes(searchText) || item.name.includes(searchText)) &&
    (selectedType === '' || item.category === selectedType)
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã cây cảnh',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên cây',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số tiền',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Mô hình kinh doanh',
      dataIndex: 'businessModel',
      key: 'businessModel',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
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
          placeholder="Tìm kiếm theo mã sản phẩm/ tên sản phẩm"
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
          <Option value="Cây phong thủy">Cây phong thủy</Option>
          <Option value="Cây cảnh">Cây cảnh</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      />
    </div>
  );
};

export default PlantsMng;
