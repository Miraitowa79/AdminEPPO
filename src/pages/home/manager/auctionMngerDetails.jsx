import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Typography,
  Card,
  Spin,
  message,
  Button,
  DatePicker,
  Select,
} from "antd";
import moment from "moment";
import {
  getAuctionDetails,
  updateAuctionRoom,
} from "../../../api/auctionManagement";
import { getAccounts } from "../../../api/accountManagement";
import { getAccountDetails } from "../../../api/accountManagement";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";

const { Title } = Typography;
const { Option } = Select;

const AuctionDetails = () => {
  const { id } = useParams(); // lấy id từ URL params
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [udata, setUdata] = useState({}); // sửa usetData thành setUdata
  const [accounts, setAccounts] = useState([]); // Tạo state cho tài khoản
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [prevStatus, setPrevStatus] = useState(1);
  const [status, setStatus] = useState(1);
  const [account, setAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  useEffect(() => {
    const fetchAccountDetails = async (modificationById) => {
      try {
        const response = await getAccountDetails(modificationById);
        setUdata(response.data); // Cập nhật state udata với dữ liệu trả về từ API
        console.log("API Response:", response);
        console.log("Account data:", response.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
        message.error("Lỗi khi tải thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    };

    if (data?.room?.modificationBy) {
      fetchAccountDetails(data.room.modificationBy);
    }
  }, [data?.room?.modificationBy]);

  useEffect(() => {
    const fetchAuctionDetails = async (id) => {
      setLoading(true);
      try {
        const { data } = await getAuctionDetails(id);
        setData(data);
        form.setFieldsValue({
          registrationOpenDate: moment.utc(data.room.registrationOpenDate),
          registrationEndDate: moment.utc(data.room.registrationEndDate),
          priceStep: data.room.priceStep,
          registrationFee: data.room.registrationFee,
          activeDate: moment.utc(data.room.activeDate),
          endDate: moment.utc(data.room.endDate),
          status: data.room.status,
          modificationBy: data.room.modificationBy,
        });
        setIsEditing(false);
        const accountDetails = await getAccountDetails(
          data.room.modificationBy
        );
        setAccount(accountDetails);
        console.log("data-auction:", data);
        console.log(
          "log time registrationOpenDate:",
          data.room.registrationOpenDate
        );
        console.log(
          "log time registrationEndDate:",
          data.room.registrationEndDate
        );
        console.log("log time activeDate:", data.room.activeDate);
        console.log("log time endDate:", data.room.endDate);

        console.log(
          "Raw registrationOpenDate:",
          data.room.registrationOpenDate
        );
        console.log(
          "Formatted registrationOpenDate:",
          moment.utc(data.room.registrationOpenDate).toISOString()
        );
        console.log("Form Values:", form.getFieldsValue());
      } catch (error) {
        console.error("Error fetching auction details:", error);
        message.error("Error fetching auction details");
      } finally {
        setLoading(false);
      }
    };

    const fetchAccounts = async () => {
      try {
        const { data } = await getAccounts({});
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        message.error("Error fetching accounts");
      }
    };

    if (id) {
      fetchAuctionDetails(id);
      fetchAccounts();
    }
  }, [id, form]);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Chờ xác nhận";
      case 2:
        return "Đang hoạt động";
      case 3:
        return "Đấu giá thành công";
      case 4:
        return "Đấu giá thất bại";
      case 5:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const updatedData = {
        ...data.room,
        registrationOpenDate: values.registrationOpenDate.toISOString(),
        registrationEndDate: values.registrationEndDate.toISOString(),
        priceStep: values.priceStep,
        registrationFee: values.registrationFee,
        activeDate: values.activeDate.toISOString(),
        endDate: values.endDate.toISOString(),

        status: values.status,
        // modificationBy: values.modificationBy,
        modificationDate: new Date().toISOString(),
      };

      await updateAuctionRoom(id, updatedData);
      message.success("Cập nhật thành công !");
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to fetch data:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    // Set lại giá trị của các trường trong form về giá trị ban đầu mà không reset toàn bộ form
    form.setFieldsValue({
      registrationOpenDate: moment.utc(data.room.registrationOpenDate),
      registrationEndDate: moment.utc(data.room.registrationEndDate),
      priceStep: data.room.priceStep,
      registrationFee: data.room.registrationFee,
      activeDate: moment.utc(data.room.activeDate),
      endDate: moment.utc(data.room.endDate),
      status: data.room.status,
      modificationBy: data.room.modificationBy,
    });

    // Đặt lại trạng thái chỉnh sửa
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Spin tip="Loading..." style={{ display: "block", margin: "auto" }} />
    );
  }

  return (
    <ConfigProvider locale={viVN}>
      <div
        style={{
          padding: "20px",
          maxWidth: "1800px",
          margin: "auto",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ flex: 2 }}>
          <Title level={3} style={{ textAlign: "center" }}>
            CHI TIẾT CUỘC ĐẤU GIÁ
          </Title>
          <Card>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
            >
              <Form.Item label="Id Phòng đấu giá" className="blurred-field">
                <Input value={data.room.roomId || ""} readOnly />
              </Form.Item>

              <Form.Item label="Người tạo phòng" className="blurred-field">
                <Input
                  value={udata?.fullName || "Không có thông tin"}
                  readOnly
                />
              </Form.Item>
              <Form.Item
                name="registrationOpenDate"
                label="Ngày mở đăng ký"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker
                  showTime
                  disabled={!isEditing}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  } // Không cho chọn ngày quá khứ
                />
              </Form.Item>
              <Form.Item
                name="registrationEndDate"
                label="Ngày đóng đăng ký"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker
                  showTime
                  disabled={!isEditing}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  } // Không cho chọn ngày quá khứ
                />
              </Form.Item>
              <Form.Item
                name="registrationFee"
                label="Phí đăng ký"
                rules={[
                  { required: true, message: "Vui lòng nhập phí đăng ký" },
                  () => ({
                    validator(_, value) {
                      if (!value || (Number(value) > 0 && !isNaN(value))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Phí đăng ký phải là số dương")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type="number" // Chỉ cho phép nhập số
                  inputMode="decimal" // Đảm bảo giao diện số trên các thiết bị hỗ trợ
                  min="1" // Ngăn giá trị âm
                  step="any" // Hỗ trợ số thập phân nếu cần
                  disabled={!isEditing || status !== 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) < 0 || isNaN(Number(value))) {
                      e.target.value = ""; // Xóa giá trị không hợp lệ
                    }
                  }}
                  placeholder="Chỉ nhập số dương"
                />
              </Form.Item>

              <Form.Item
                name="priceStep"
                label="Bước đấu giá"
                rules={[
                  { required: true, message: "Vui lòng nhập bước đấu giá" },
                  () => ({
                    validator(_, value) {
                      if (!value || (Number(value) > 0 && !isNaN(value))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Bước đấu giá phải là số dương")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type="number" // Chỉ cho phép nhập số
                  inputMode="decimal" // Bàn phím số thập phân cho các thiết bị di động
                  min="1" // Không cho phép nhập giá trị âm
                  step="any" // Hỗ trợ số thập phân nếu cần
                  disabled={!isEditing || status !== 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Number(value) < 0 || isNaN(Number(value))) {
                      e.target.value = ""; // Xóa giá trị không hợp lệ
                    }
                  }}
                  placeholder="Chỉ nhập số dương"
                />
              </Form.Item>

              <Form.Item
                name="activeDate"
                label="Thời gian diễn ra"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker
                  showTime
                  disabled={!isEditing}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  } // Không cho chọn ngày quá khứ
                />
              </Form.Item>

              <Form.Item
                name="endDate"
                label="Thời gian kết thúc"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker
                  showTime
                  disabled={!isEditing}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  } // Không cho chọn ngày quá khứ
                />
              </Form.Item>

              {/* <Form.Item label="Thời gian chơi (Giây) ">
            <Input value={calculateDuration()} readOnly />
          </Form.Item> */}
              <Form.Item
                label="Ngày tạo cuộc đấu giá"
                className="blurred-field"
              >
                <Input
                  value={
                    new Date(data.room.creationDate).toLocaleDateString() || ""
                  }
                  readOnly
                />
              </Form.Item>
              <Form.Item
                label="Thời gian sửa đổi lần cuối"
                className="blurred-field"
              >
                <Input
                  value={
                    new Date(data.room.modificationDate).toLocaleDateString() ||
                    ""
                  }
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái cuộc đấu giá"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select
                  value={status}
                  placeholder="Select status"
                  disabled={!isEditing}
                  onChange={handleStatusChange}
                >
                  {/* Hiển thị các tùy chọn dựa trên trạng thái hiện tại */}
                  {[
                    { value: 1, label: "Chờ xác nhận" },
                    { value: 2, label: "Đang hoạt động" },
                    { value: 3, label: "Đấu giá thành công" },
                    { value: 4, label: "Đấu giá thất bại" },
                    { value: 5, label: "Đã hủy" },
                  ].map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      disabled={option.value < status} // Không cho phép quay lại trạng thái trước đó
                    >
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                {isEditing ? (
                  <>
                    <Button
                      type="default"
                      danger
                      style={{ marginRight: "10px" }}
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleUpdate}
                      loading={isSubmitting}
                      style={{ marginRight: "10px" }}
                    >
                      Cập nhật
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => setIsEditing(true)}
                    style={{ width: "90px" }}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <Title
            level={4}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            THÔNG TIN CÂY ĐẤU GIÁ
          </Title>
          <Card>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={styles.label}>
                    <strong>Mã cây:</strong>
                  </td>
                  <td style={styles.value}>{data.room.plant.plantId || ""}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Tên cây:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.room.plant.plantName || ""}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Tiêu đề:</strong>
                  </td>
                  <td style={styles.value}>{data.room.plant.title || ""}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Mô tả:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.room.plant.description || ""}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Hình ảnh:</strong>
                  </td>
                  <td style={styles.value}>
                    <a
                      href={data.room.plant.mainImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem ảnh
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Giá:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.room.plant.finalPrice || ""}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Hình thức:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.room.plant.typeEcommerceId === 1
                      ? "Cây bán"
                      : data.room.plant.typeEcommerceId === 2
                      ? "Cây thuê"
                      : data.room.plant.typeEcommerceId === 3
                      ? "Cây đấu giá"
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Trạng thái hoạt động:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.room.plant.isActive
                      ? "Có thể đặt mua / thuê / mang vào đấu giá."
                      : "Không thể thuê, mua, đấu giá."}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Ngày tạo cây:</strong>
                  </td>
                  <td style={styles.value}>
                    {new Date(
                      data.room.plant.creationDate
                    ).toLocaleDateString() || ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};
const styles = {
  label: {
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  value: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
};

export default AuctionDetails;
