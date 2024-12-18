import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Spin,
  message,
  Avatar,
  Upload,
  DatePicker,
  Select,
} from "antd";
import { getPlantDetails, updatePlant } from "../../../api/plantsManagement";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { getAuthUser } from "@utils/index";
import { getAccountDetails } from "../../../api/accountManagement";

const { Title } = Typography;

const PlantAuctionDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getAuthUser();
  const [extraForm] = Form.useForm();
  const [file, setFile] = useState(null);
  const [accountDetails, setAccountDetails] = useState({});
  useEffect(() => {
    const fetchPlantDetails = async (id) => {
      try {
        const response = await getPlantDetails(id);
        console.log("plantId:", response.data.plantId);
        setData(response.data);

        form.setFieldsValue(response.data); // Set form fields with fetched data
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPlantDetails(id);
    }
  }, [id, form]);
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await getAccountDetails(data.code);
        setAccountDetails(response.data);
        console.error("Data user:", response.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
        message.error("Lỗi khi tải thông tin tài khoản.");
      }
    };

    if (data.code) {
      fetchAccountDetails();
    }
  }, [data.code]);
  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const updatedData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] !== data[key] && values[key] !== undefined) {
          if (key === "activeDate" || key === "endDate") {
            updatedData.append(
              key,
              values[key] ? values[key].toISOString() : null
            );
          } else {
            updatedData.append(key, values[key]);
          }
        }
      });

      const fileList = form.getFieldValue("mainImageFile"); // Retrieve uploaded file(s)

      // Check if fileList contains files
      if (fileList && fileList.length > 0) {
        // Access the actual file from originFileObj
        const file = fileList[0].originFileObj;
        if (file) {
          updatedData.append("mainImageFile", file); // Append the file to FormData
        }
      }
      console.log("Retrieved fileList:", fileList);

      updatedData.plantId = data.plantId;
      updatedData.modificationDate = new Date().toISOString();
      updatedData.modificationBy = user?.userId;

      console.log("Updated data being sent to API:", updatedData);

      const response = await updatePlant(data.plantId, updatedData);
      if (response?.statusCode === 200) {
        message.success("Cập nhật thành công!");
        setData({ ...data, ...updatedData });
        setEditMode(false);
        fetchPlantDetails(data.plantId);
        window.location.href = window.location.href;
      } else {
        message.error("Failed to update plant");
      }
    } catch (error) {
      console.error("Error updating plant:", error);
      message.error("Failed to update plant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    form.setFieldsValue(data); // Reset the form to initial values
  };

  const handleFinish = (updatedData) => {
    console.log("Updated data:", updatedData);
    setData(updatedData);
    setEditMode(false);
    message.success("Plant details updated successfully");
  };

  if (loading) {
    return (
      <Spin tip="Loading..." style={{ display: "block", margin: "auto" }} />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
      }}
    >
      {/* Main Form on the Left */}
      <div style={{ flex: 4 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          CHI TIẾT CÂY CẢNH
        </Title>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Button type="primary" shape="round">
              Mã cây: {data.plantId}
            </Button>
          </div>
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            onFinish={handleUpdate}
          >
            <Form.Item
              label="Hình ảnh"
              name="mainImageFile"
              valuePropName="fileList"
            >
              <Avatar
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "50%",
                  marginRight: "20px",
                }}
                src={data.mainImage}
              />
              {editMode && (
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={(info) => {
                    form.setFieldsValue({
                      mainImageFile: info.fileList,
                    });
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              )}
            </Form.Item>

            <Form.Item label="Tên cây:" name="plantName">
              <Input readOnly={!editMode} />
            </Form.Item>

            <Form.Item label="Mô tả ngắn:" name="title">
              <Input readOnly={!editMode} />
            </Form.Item>

            <Form.Item label="Chi tiết:" name="description">
              <Input.TextArea readOnly={!editMode} />
            </Form.Item>

            <Form.Item label="Chiều dài:" name="length">
              <Input
                readOnly={!editMode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    return;
                  }
                  form.setFieldsValue({
                    length: value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Chiều rộng:" name="width">
              <Input
                readOnly={!editMode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    return;
                  }
                  form.setFieldsValue({
                    width: value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item label="Chiều cao:" name="height">
              <Input
                readOnly={!editMode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[+]?\d+(\.\d{1,2})?$/.test(value)) {
                    form.setFieldsValue({
                      height: value,
                    });
                  }
                }}
              />
            </Form.Item>

            <Form.Item label="Giá bán:" name="finalPrice">
              <Input
                readOnly={!editMode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^(\d+(\.\d{1,2})?)?$/.test(value)) {
                    return;
                  }
                  form.setFieldsValue({
                    finalPrice: value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item label="Ngày tạo:" name="creationDate">
              <Input
                value={moment(data.creationDate).format("YYYY-MM-DD")}
                readOnly
              />
            </Form.Item>

            <Form.Item label="Ngày kết thúc:" name="modificationDate">
              <Input
                value={moment(data.creationDate).format("YYYY-MM-DD")}
                readOnly
              />
            </Form.Item>

            <Form.Item label="Trạng thái cây:" name="isActive">
              <Select
                disabled={!editMode}
                style={{
                  color: data.isActive === true ? "green" : "gray",
                  fontWeight: "bold",
                }}
              >
                <Option value={true}>Có thể đấu giá cây</Option>
                <Option value={false}>Không thể đấu giá cây</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái cây:" name="status">
              <Select disabled={!editMode}>
                <Option value={1}>Đã tạo</Option>
                <Option value={2}>Đã duyệt</Option>
                <Option value={0}>Đã hủy</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              {editMode ? (
                <>
                  <Button
                    type="default"
                    danger
                    style={{ marginRight: "10px" }}
                    onClick={handleCancelClick}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Lưu
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={handleUpdateClick}>
                  Cập nhật
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Auction Information */}
      <div style={{ flex: 1, padding: "20px", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            THÔNG TIN CHỦ CÂY
          </Title>
          <Card>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.label}>
                    <strong>Họ và tên:</strong>
                  </td>
                  <td style={styles.value}>
                    {accountDetails.fullName || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Giới tính:</strong>
                  </td>
                  <td style={styles.value}>{accountDetails.gender || "N/A"}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Số điện thoại:</strong>
                  </td>
                  <td style={styles.value}>
                    {accountDetails.phoneNumber || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Email:</strong>
                  </td>
                  <td style={styles.value}>{accountDetails.email || "N/A"}</td>
                </tr>
                {/* <tr>
                  <td style={styles.label}>
                    <strong>Địa chỉ:</strong>
                  </td>
                  <td style={styles.value}>
                    {accountDetails.addresses &&
                    accountDetails.addresses.length > 0 ? (
                      <ul>
                        {accountDetails.addresses.map((address, index) => (
                          <li key={index}>{address || "N/A"}</li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr> */}
                <tr>
                  <td style={styles.label}>
                    <strong>Địa chỉ:</strong>
                  </td>
                  <td style={styles.value}>
                    {accountDetails &&
                    accountDetails.addresses &&
                    accountDetails.addresses.length > 0 ? (
                      accountDetails.addresses.length === 1 ? (
                        <span>
                          {accountDetails.addresses[0].description || "N/A"}
                        </span> // Nếu chỉ có một địa chỉ
                      ) : (
                        <ul>
                          {accountDetails.addresses.map((address, index) => (
                            <li key={index}>{address.description || "N/A"}</li> // Hiển thị địa chỉ từ description
                          ))}
                        </ul>
                      )
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Hình ảnh:</strong>
                  </td>

                  <td style={styles.value}>
                    <img
                      src={accountDetails?.imageUrl}
                      alt={accountDetails.imageUrl}
                      style={styles.image}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
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

export default PlantAuctionDetails;
