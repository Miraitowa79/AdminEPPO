import React, { useState ,useEffect} from 'react';
import { Table, Input, Button, Pagination, Space, Select, Avatar } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { apiPlant } from '../../../api/apiConfig'; 
import { getListPlantRenting, getPlantDetails } from '../../../api/plantsManagement';
import { useNavigate } from 'react-router-dom';
import avatar from "../../../assets/images/team-2.jpg";

const { Option } = Select;

const PlantsRenting = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [data, setData] = useState([]); 

  const [loading, setLoading] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 5;

  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await getListPlantRenting({ pageIndex: page, pageSize, search });
      const items = response;
      setData(items.data);
      console.log("date plant renting:",items)
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
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);


  const handleSearch = () => {
    setCurrentPage(1); 
    fetchData(1, searchText); 
  };
  
  const handleViewDetails = (record) => {
    navigate(`/manager/products/plants/renting/${record.plantId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); 
  };
 
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  // const filteredData = data.filter(item => 
  //   (item.code.includes(searchText) || item.name.includes(searchText)) &&
  //   (selectedType === '' || item.category === selectedType)
  // );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1, 
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'mainImage',
        key: 'mainImage',
        render: (mainImage) => <Avatar src={mainImage ? mainImage : avatar} />,
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
      ellipsis: true,
    },
    {
      title: 'Mô hình kinh doanh',
      dataIndex: 'typeEcommerceId',
      key: 'typeEcommerceId',
    },
    {
        title: 'Loại Cây',
        dataIndex: 'categoryId',
        key: 'categoryId',
      },
    {
        title: 'Chủ cây',
        dataIndex: 'modificationBy',
        key: 'modificationBy',
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
        rowKey="plantId"
        loading={loading}
      />
      {/* <Table columns={columns} dataSource={filteredData} pagination={false} /> */}
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
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

export default PlantsRenting;
