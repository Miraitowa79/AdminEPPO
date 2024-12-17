import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Pagination,
  Space,
  Select,
  Avatar,
  Tag,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { apiPlant } from "../../../api/apiConfig";
import {
  getListPlantAuction,
  getAllCategories,
  getPlantDetails,
} from "../../../api/plantsManagement";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/images/team-2.jpg";
const { Option } = Select;

const PlantsAuction = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [plantsData, setPlantsData] = useState([]);

  // const fetchData = async (page = 1, search = '') => {
  //   setLoading(true);
  //   try {

  //     const response = await getListPlantSale({ pageIndex: page, pageSize, search: search || '' });
  //     const items = response;
  //     setData(items.data);

  //     if (items.length < pageSize) {
  //       setTotalItems((page - 1) * pageSize + items.length);
  //     } else {
  //       setTotalItems((page + 1) * pageSize);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async (page = 1, search = "") => {
    setLoading(true);
    try {
      if (search) {
        // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
        const response = await SearchPlant(search, page);
        setData(response.data); // Cập nhật dữ liệu tìm được
      } else {
        // Nếu không có từ khóa tìm kiếm, gọi API lấy tất cả dữ liệu
        const response = await getListPlantAuction({
          pageIndex: page,
          pageSize,
          search: search || "",
        });
        setData(response.data);
      }

      // Cập nhật totalItems cho pagination
      if (response.data.length < pageSize) {
        setTotalItems((page - 1) * pageSize + response.data.length);
      } else {
        setTotalItems(page * pageSize);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const SearchPlant = async (keyword, page = 1) => {
    try {
      const response = await axios.get(
        "https://sep490ne-001-site1.atempurl.com/api/v1/GetList/Plants/Search/PlantID",
        {
          params: {
            pageIndex: page,
            pageSize: 100, // Bạn có thể điều chỉnh pageSize ở đây nếu cần
            typeEcommerceId: 3,
            keyWord: keyword,
          },
        }
      );

      if (response.data?.data) {
        return response.data; // Trả về dữ liệu tìm kiếm
      } else {
        return { data: [] }; // Nếu không có dữ liệu, trả về mảng trống
      }
    } catch (error) {
      console.error("Error fetching plants data:", error);
      return { data: [] }; // Nếu có lỗi, trả về mảng trống
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  useEffect(() => {
    fetchData(currentPage, searchText);
  }, [currentPage, searchText]);

  useEffect(() => {
    if (searchText) {
      SearchPlant(searchText); // Call SearchPlant when the searchText changes
    }
  }, [searchText]); // Dependency array, triggers whenever searchText changes

  const handleSearch = () => {
    SearchPlant(searchText); // Trigger the search when the user clicks the search icon
  };

  const handleViewDetails = (record) => {
    navigate(`/manager/products/plants/sale/${record.plantId}`);
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
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
      render: (mainImage) => <Avatar src={mainImage ? mainImage : avatar} />,
    },
    // {
    //   title: 'Mã cây cảnh',
    //   dataIndex: 'plantId',
    //   key: 'plantId',

    // },
    {
      title: "Tên cây",
      dataIndex: "plantName",
      key: "plantName",
      ellipsis: true,
    },
    // {
    //   title: 'Tiêu đề',
    //   dataIndex: 'title',
    //   key: 'title',
    //   ellipsis: true,
    // },
    // {
    //   title: 'Số tiền',
    //   dataIndex: 'price',
    //   key: 'price',
    // },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    //   key: 'description',
    //   ellipsis: true,
    // },
    // {
    //   title: 'Mô hình kinh doanh',
    //   dataIndex: 'typeEcommerceId',
    //   key: 'typeEcommerceId',
    // },
    // {
    //     title: 'Loại Cây',
    //     dataIndex: 'categoryId',
    //     key: 'categoryId',
    //   },
    // {
    //     title: 'Chủ cây',
    //     dataIndex: 'modificationBy',
    //     key: 'modificationBy',
    //   },
    {
      title: "Số tiền",
      dataIndex: "finalPrice",
      key: "finalPrice",
      ellipsis: true,
      render: (value) => `${value.toLocaleString("vi-VN")} đ`,
    },

    {
      title: "Hiệu lực",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => {
        let statusText = "";
        let color = "";

        if (isActive === true) {
          statusText = "Có thể mua cây";
          color = "green"; // Màu xanh
        } else if (isActive === false) {
          statusText = "Không thể đặt/thuê/mua";
          color = "red"; // Màu đỏ
        } else {
          statusText = "Không xác định";
          color = "gray"; // Màu xám
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },

    // {
    //   title: 'Trạng Thái',
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusText = "";
        let color = "";

        switch (status) {
          case 1:
            statusText = "Đã tạo";
            color = "blue"; // Màu đỏ cho "Ngừng hoạt động"
            break;
          case 2:
            statusText = "Đang hoạt động";
            color = "green"; // Màu xanh cho "Đang hoạt động"
            break;
          default:
            statusText = "Không rõ";
            color = "gray"; // Màu xám cho "Không rõ"
            break;
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
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
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          suffix={
            <SearchOutlined
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            />
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: "50%" }}
        />
        {/* <Select
          placeholder="Chọn loại cây"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: '200px', marginLeft: 'auto' }}
        >
          <Option value="">Tất cả</Option>
          <Option value="Cây phong thủy">Cây phong thủy</Option>
          <Option value="Cây cảnh">Cây cảnh</Option>
        </Select> */}
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
        style={{
          textAlign: "center",
          marginTop: "20px",
          justifyContent: "right",
        }}
      />
      {/* <Pagination
        defaultCurrent={1}
        total={100}
        style={{ textAlign: 'center', marginTop: '20px' , justifyContent: 'right'}}
      /> */}
    </div>
  );
};

export default PlantsAuction;
