import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Select, Tag, Tabs, Input } from "antd";
import { EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getContracts,
  getContractStatus,
} from "../../../api/contractManagement";
import moment from "moment";
import "./contractManagement.scss";

const { Option } = Select;
const { TabPane } = Tabs;

const ContractMng = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [activeTab, setActiveTab] = useState("main");
  const pageSize = 100;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  // const fetchData = async (page = 1, status = "") => {
  //   setLoading(true);
  //   try {
  //     const response = status
  //       ? await getContractStatus({ page, size: pageSize, status })
  //       : await getContracts({ page, size: pageSize });

  //     const { data: items } = response;

  //     setData(
  //       items
  //         .filter((item) => item.isAddendum === (activeTab === "addendum"))
  //         .map((item, index) => ({
  //           ...item,
  //           key: item.contractId,
  //           userId: item.user.userName,
  //           totalAmount: item.totalAmount.toLocaleString("vi-VN", {
  //             style: "currency",
  //             currency: "VND",
  //           }),
  //           creationContractDate: moment(item.creationContractDate).format(
  //             "DD-MM-YYYY"
  //           ),
  //           endContractDate: moment(item.endContractDate).format("DD-MM-YYYY"),
  //           status: item.status === 1 ? "Đang hoạt động" : "Hết hạn",
  //         }))
  //     );

  //     if (items.length < pageSize) {
  //       setTotalItems((page - 1) * pageSize + items.length);
  //     } else {
  //       setTotalItems((page + 1) * pageSize + items.length);
  //     }
  //     console.log("API Response:", response.data);
  //     console.log("Items length:", response.data.length);
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async (page = 1, status = "") => {
    setLoading(true);
    try {
      let response;
      if (search) {
        // Use the SearchContract function if there's a search term
        response = await SearchContract(search, page);
      } else {
        // Fetch contracts or contract status based on status filter
        response = status
          ? await getContractStatus({ page, size: pageSize, status })
          : await getContracts({ page, size: pageSize });
      }

      const { data: items } = response;

      setData(
        items
          .filter((item) => item.isAddendum === (activeTab === "addendum"))
          .map((item) => ({
            ...item,
            key: item.contractId,
            userId: item.user.userName,
            totalAmount: item.totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }),
            creationContractDate: moment(item.creationContractDate).format(
              "DD-MM-YYYY"
            ),
            endContractDate: moment(item.endContractDate).format("DD-MM-YYYY"),
            status: item.status === 1 ? "Đang hoạt động" : "Hết hạn",
          }))
      );

      // Set total items based on the response length
      if (items.length < pageSize) {
        setTotalItems((page - 1) * pageSize + items.length);
      } else {
        setTotalItems(page * pageSize + items.length);
      }

      console.log("API Response:", response.data);
      console.log("Items length:", items.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const SearchContract = async (keyword, page = 1) => {
    try {
      const response = await axios.get(
        "https://sep490ne-001-site1.atempurl.com/api/v1/Search/Contract",
        {
          params: {
            pageIndex: page,
            pageSize: 100, // Adjust pageSize as necessary
            keyWord: keyword,
          },
        }
      );

      // Ensure the response has data and return it, else return empty data
      return response.data?.data ? response.data : { data: [] };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [] };
    }
  };
  useEffect(() => {
    fetchData(currentPage, searchText, selectedType);
  }, [currentPage, searchText, selectedType]);

  const handleSearch = () => {
    fetchData(1, searchText, selectedType);
  };
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData(currentPage, selectedType);
  }, [currentPage, selectedType, activeTab]);

  const handleViewDetails = (record) => {
    navigate(`/manager/contract/${record.contractId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã HĐ",
      dataIndex: "contractId",
      key: "contractId",
    },
    {
      title: "Chủ hợp đồng",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: 'Số tiền',
    //   dataIndex: 'totalAmount',
    //   key: 'totalAmount',
    // },
    {
      title: "Mã ĐH",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Ngày tạo",
      dataIndex: "creationContractDate",
      key: "creationContractDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endContractDate",
      key: "endContractDate",
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "typeContract",
      key: "typeContract",
      filters: [
        { text: "Hợp Tác Kinh Doanh", value: "Hợp Tác Kinh Doanh" },
        { text: "Thuê Cây", value: "Thuê Cây" },
      ],
      onFilter: (value, record) => record.typeContract === value,
    },

    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang hoạt động", value: "Đang hoạt động" },
        { text: "Hết hạn", value: "Hết hạn" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        let color = "gray";
        if (text === "Đang hoạt động") color = "green";
        else if (text === "Hết hạn") color = "red";

        return <Tag color={color}>{text}</Tag>;
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

  // Function to determine row class
  const rowClassName = (record) => {
    return record.creationContractDate === record.endContractDate &&
      record.status === "Đang hoạt động"
      ? "red-row"
      : "";
  };

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
          placeholder="Tìm kiếm theo  mã hợp đồng"
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
          placeholder="Chọn trạng thái"
          value={selectedType}
          onChange={handleTypeChange}
          style={{ width: "200px" }}
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
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
        <TabPane tab="Phụ lục" key="addendum">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            rowClassName={rowClassName}
          />
        </TabPane>
      </Tabs>
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

export default ContractMng;
