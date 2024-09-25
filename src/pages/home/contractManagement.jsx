import React, { useState } from 'react';
import { Table, Input, Button, Pagination, Space } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const data = [
  {
    key: '1',
    contractId: 'HD1232',
    owner: 'Nguyễn Văn A',
    amount: '5.000.000',
    startDate: '12-09-2024',
    endDate: '20-09-2024',
    status: 'Hết hạn',
  },
  {
    key: '2',
    contractId: 'HD2232',
    owner: 'Nguyễn Văn B',
    amount: '5.000.000',
    startDate: '12-09-2024',
    endDate: '20-12-2024',
    status: 'Đang hợp tác',
  },
];

const ContractMng = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Search:', searchText);
  };

  const handleViewDetails = (record) => {
    console.log('View details:', record);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã hợp đồng',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: 'Chủ hợp đồng',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Ngày kí',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
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
      <Input
        placeholder="Tìm kiếm theo họ và tên/ mã hợp đồng"
        suffix={
          <SearchOutlined
            onClick={handleSearch}
            style={{ cursor: 'pointer' }}
          />
        }
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={handleSearch}
        style={{ marginBottom: '20px', width: '50%' }}
      />
      <Table columns={columns} dataSource={data} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      />
    </div>
  );
};

export default ContractMng;
