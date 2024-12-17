import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, message, Select, Tag } from "antd";
import { SearchOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAuctions, getAuctionStatus } from "../../../api/auctionManagement";

const AuctionMng = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [selectedType, setSelectedType] = useState("");

  const fetchData = async (page = 1, search = "", status = "") => {
    setLoading(true);
    try {
      const response = status
        ? await getAuctionStatus({ page, size: pageSize, search, status })
        : await getAuctions({ page, size: pageSize, search });
      const items = response.data;
      setData(items);

      if (items.length < pageSize) {
        setTotalItems((page - 1) * pageSize + items.length);
      } else {
        setTotalItems((page + 1) * pageSize);
      }
    } catch (error) {
      console.error(
        "Failed to fetch data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchText, selectedType);
  }, [currentPage, searchText, selectedType]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchText, selectedType);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (record) => {
    navigate(`/manager/auction/${record.roomId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã phòng",
      dataIndex: "roomId",
      key: "roomId",
    },
    {
      title: "Tên cây",
      dataIndex: ["plant", "plantName"],
      key: "plantName",
    },
    {
      title: "Phí đăng ký",
      dataIndex: "registrationFee",
      key: "registrationFee",
      render: (fee) => fee.toLocaleString(),
    },
    {
      title: "Ngày tạo",
      dataIndex: "creationDate",
      key: "creationDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "activeDate",
      key: "activeDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Trạng thái đấu giá",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusText = "";
        let color = "";

        // Xử lý màu sắc và văn bản theo giá trị trạng thái
        switch (status) {
          case 1:
            statusText = "Chờ xác nhận";
            color = "yellow"; // Màu vàng cho trạng thái 1
            break;
          case 2:
            statusText = "Đang hoạt động";
            color = "blue"; // Màu xanh dương cho trạng thái 2
            break;
          case 3:
            statusText = "Đấu giá thành công";
            color = "green"; // Màu xanh lá cho trạng thái 3
            break;
          case 4:
            statusText = "Đấu giá thất bại";
            color = "red"; // Màu đỏ cho trạng thái 4
            break;
          case 5:
            statusText = "Đã hủy";
            color = "gray"; // Màu xám cho trạng thái 5
            break;
          default:
            statusText = "Không xác định";
            color = "black"; // Màu đen cho trạng thái không xác định
        }

        // Trả về Tag với màu sắc và văn bản trạng thái
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Xem",
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
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search by plant name"
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
        <Select
          placeholder="Chọn loại cây"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: "200px", marginLeft: "auto" }}
        >
          <Option value="">Tất cả</Option>
          <Option value="1">Chờ xác nhận</Option>
          <Option value="2">Đang hoạt động</Option>
          <Option value="3">Đấu giá thành công</Option>
          <Option value="4">Đấu giá thất bại</Option>
          <Option value="5">Đã hủy</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="roomId"
        loading={loading}
      />
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
    </div>
  );
};

export default AuctionMng;
