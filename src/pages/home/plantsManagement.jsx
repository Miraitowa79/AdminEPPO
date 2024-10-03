import React, { useState ,useEffect} from 'react';
import { Table, Input, Button, Pagination, Space, Select } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { apiPlant } from '../../api/apiConfig'; 
const { Option } = Select;

const PlantsMng = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 10;
  
  //Get API Plants
  const fetchData = async (page = 1, search = '') => {
    setLoading(true); 
    try {
      const response = await axios.get(apiPlant.getListPlant, {
        params: {
          page: page,
          size: pageSize,
          search: search
        }
      });
      const { data: items } = response.data; 
      setData(items);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
    console.log('View details:', record);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page); 
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
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1, 
    },
    {
      title: 'Mã cây cảnh',
      dataIndex: 'plantId',
      key: 'plantId',
  
    },
    {
      title: 'Tên cây',
      dataIndex: 'plantName',
      key: 'plantName',
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
      dataIndex: 'typeEcommerceId',
      key: 'typeEcommerceId',
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
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        loading={loading}
      />
      {/* <Table columns={columns} dataSource={filteredData} pagination={false} /> */}
      <Pagination
        defaultCurrent={1}
        total={100}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      />
      {/* <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      /> */}
    </div>
  );
};

export default PlantsMng;
