import React, { useState } from 'react';
import { Table, Input, Avatar, Button, Pagination, Space } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import avatar from "../../assets/images/team-2.jpg";

const data = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0333888257',
    status: 'Đang hoạt động',
  },
  {
    key: '2',
    name: 'Nguyễn Văn B',
    email: 'nguyenvanb@gmail.com',
    phone: '0333888257',
    status: 'Ngưng hoạt động',
  },
];

const accountMng = () => {
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
      title: 'Avata',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => <Avatar src={avatar} />,
    },
    {
      title: 'Họ Và Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
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
        placeholder="Tìm kiếm theo họ và tên/ email/ số điện thoại"
        suffix={
          <SearchOutlined
            onClick={handleSearch}
            style={{ cursor: 'pointer' }}
          />
        }
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={handleSearch}
        style={{ marginBottom: '20px' , width: '50%'}}
      />
      <Table columns={columns} dataSource={data} pagination={false} />
      <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px', justifyContent: 'right' }}
      />
    </div>
  );
};

export default accountMng;
