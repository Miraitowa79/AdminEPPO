import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  Spin,
  message,
  Image,
  Form,
  Select,
  Button,
  Input,
} from "antd";
import {
  getFeedbackDetails,
  updateFeedbackDetails,
} from "../../../api/feedbackManagement";
import { getAuthUser } from "@src/utils";

const { Title } = Typography;
const { Option } = Select;

const FeedbackDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const authUser = getAuthUser();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchFeedbackDetails = async (id) => {
      try {
        const response = await getFeedbackDetails(id);
        const feedbackData = response.data;
        setData(feedbackData);
        form.setFieldsValue(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        message.error("Error fetching feedback details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedbackDetails(id);
    }
  }, [id, form]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    form.setFieldsValue(data);
  };

  const handleFinish = async (updatedData) => {
    try {
      const updatedFeedback = {
        ...data,
        ...updatedData,
        modificationByUserId: getAuthUser().userId,
        modificationByUser: getAuthUser().fullName,
        modificationDate: new Date().toISOString(),
      };
      await updateFeedbackDetails(id, updatedFeedback);
      setData(updatedFeedback);
      setEditMode(false);
      message.success("Cập nhật phản hồi thành công!");
    } catch (error) {
      console.log("Cập nhật không thành công!", error);
      message.error("Cập nhật không thành công!");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Chờ xử lý";
      case 2:
        return "Đã phản hồi";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <Spin tip="Loading..." style={{ display: "block", margin: "auto" }} />
    );
  }

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let color = "lightgray";
      if (i <= rating) {
        if (rating <= 1) color = "red";
        else if (rating <= 3) color = "orange";
        else color = "gold";
      }
      stars.push(
        <span key={i} style={{ color, fontSize: "20px" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
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
          CHI TIẾT PHẢN HỒI
        </Title>
        <Card>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <table style={styles.table}>
              <tbody>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>ID Phản hồi:</strong>
                  </td>
                  <td style={styles.value}>{data.feedbackId}</td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Tiêu đề:</strong>
                  </td>
                  <td style={styles.value}>{data.title}</td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Mô tả:</strong>
                  </td>
                  <td style={styles.value}>{data.description}</td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Ngày gửi:</strong>
                  </td>
                  <td style={styles.value}>
                    {new Date(data.creationDate).toLocaleString()}
                  </td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Đánh giá:</strong>
                  </td>
                  <td style={styles.value}>{renderRatingStars(data.rating)}</td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Người phản hồi:</strong>
                  </td>
                  <td style={styles.value}>
                    {data.modificationByUser || "N/A"}
                  </td>
                </tr>
                <tr className={editMode ? "blurred-field" : ""}>
                  <td style={styles.label}>
                    <strong>Hình ảnh:</strong>
                  </td>
                  <td style={styles.value}>
                    <div style={styles.imageContainer}>
                      {data.imageFeedbacks &&
                        data.imageFeedbacks.map((img) => (
                          <Image
                            key={img.imgageFeedbackId}
                            src={img.imageUrl}
                            shape="square"
                            size={64}
                            style={styles.imageItem}
                          />
                        ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Trạng thái xử lý:</strong>
                  </td>
                  <td style={styles.value}>
                    <Form.Item name="status" style={{ marginTop: "15px" }}>
                      {editMode ? (
                        <Select style={{ width: "100%" }}>
                          <Option value={1}>Chờ xử lý</Option>
                          <Option value={2}>Đã phản hồi</Option>
                        </Select>
                      ) : (
                        <Select
                          value={data.status}
                          disabled
                          style={{ width: "100%" }}
                        >
                          <Option value={1}>Chờ xử lý</Option>
                          <Option value={2}>Đã phản hồi</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </td>
                </tr>
              </tbody>
            </table>
            {editMode ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  type="default"
                  danger
                  style={{ marginRight: "10px" }}
                  onClick={handleCancelClick}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="primary" onClick={handleEditClick}>
                  Chỉnh sửa
                </Button>
              </div>
            )}
          </Form>
        </Card>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            THÔNG TIN CÂY
          </Title>
          <Card>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.label}>
                    <strong>Tên cây:</strong>
                  </td>
                  <td style={styles.value}>{data.plant?.plantName}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Tiêu đề:</strong>
                  </td>
                  <td style={styles.value}>{data.plant?.title}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Mô tả:</strong>
                  </td>
                  <td style={styles.value}>{data.plant?.description}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Kích thước:</strong>
                  </td>
                  <td
                    style={styles.value}
                  >{`${data.plant?.length} x ${data.plant?.width} x ${data.plant?.height}`}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Giá:</strong>
                  </td>
                  <td style={styles.value}>{data.plant?.finalPrice}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Hình ảnh:</strong>
                  </td>
                  <td style={styles.value}>
                    <Image
                      src={data.plant?.mainImage}
                      alt={data.plant?.plantName}
                      style={styles.image}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{
              textAlign: "center",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            THÔNG TIN NGƯỜI MUA
          </Title>
          <Card>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.label}>
                    <strong>Họ và tên:</strong>
                  </td>
                  <td style={styles.value}>{data.user?.fullName}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Số điện thoại:</strong>
                  </td>
                  <td style={styles.value}>{data.user?.phoneNumber}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Email:</strong>
                  </td>
                  <td style={styles.value}>{data.user?.email}</td>
                </tr>
                <tr>
                  <td style={styles.label}>
                    <strong>Hình ảnh:</strong>
                  </td>
                  <td style={styles.value}>
                    <img
                      src={data.user?.imageUrl}
                      alt={data.user?.fullName}
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "10px 0",
  },
  label: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    width: "150px",
  },
  value: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  image: {
    width: "100px",
    height: "auto",
  },
  imageContainer: {
    display: "flex",
    overflowX: "scroll",
    whiteSpace: "nowrap",
    padding: "10px 0",
  },
  imageItem: {
    width: "64px",
    height: "64px",
    marginRight: "10px",
  },
};

export default FeedbackDetails;
