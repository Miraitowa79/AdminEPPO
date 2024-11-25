// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Form, Input, Typography, Card, Spin, message, Button, DatePicker, Select, Image } from 'antd';
// import moment from 'moment';
// import { getAuctionDetails, updateAuctionRoom } from '../../../api/auctionManagement';
// import { getAccounts } from '../../../api/accountManagement';

// const { Title } = Typography;
// const { Option } = Select;

// const AuctionDetails = () => {
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState({});
//   const [accounts, setAccounts] = useState([]);
//   const [form] = Form.useForm();
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const fetchAuctionDetails = async (id) => {
//       try {
//         const { data } = await getAuctionDetails(id);
//         setData(data);
//         form.setFieldsValue({
//           registrationOpenDate: moment(data.room.registrationOpenDate),
//           registrationEndDate: moment(data.room.registrationEndDate),
//           priceStep: data.room.priceStep,
//           activeDate: moment(data.room.activeDate),
//           endDate: moment(data.room.endDate),
//           status: data.room.status,
//           modificationBy: data.room.modificationBy,
//         });
//       } catch (error) {
//         console.error('Error fetching auction details:', error);
//         message.error('Error fetching auction details');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const fetchAccounts = async () => {
//       try {
//         const { data } = await getAccounts({});
//         setAccounts(data);
//       } catch (error) {
//         console.error('Error fetching accounts:', error);
//         message.error('Error fetching accounts');
//       }
//     };
  
//     if (id) {
//       fetchAuctionDetails(id);
//       fetchAccounts();
//     }
//   }, [id, form]);

//   const getStatusText = (status) => {
//     switch (status) {
//       case 1:
//         return 'Chờ xác nhận';
//       case 2:
//         return 'Đang hoạt động';
//       case 3:
//         return 'Đấu giá thành công';
//       case 4:
//         return 'Đấu giá thất bại';
//       case 5:
//         return 'Đã hủy';
//       default:
//         return 'Không xác định';
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const values = await form.validateFields();
//       const updatedData = {
//         ...data.room,
//         registrationOpenDate: values.registrationOpenDate.toISOString(),
//         registrationEndDate: values.registrationEndDate.toISOString(),
//         priceStep: values.priceStep,
//         activeDate: values.activeDate.toISOString(),
//         endDate: values.endDate.toISOString(),
//         status: values.status,
//         modificationBy: values.modificationBy,
//         modificationDate: new Date().toISOString(),
//       };
//       await updateAuctionRoom(id, updatedData);
//       message.success('Auction room updated successfully');
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating auction room:', error);
//       message.error('Error updating auction room');
//     }
//   };

//   const toggleEdit = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleCancelEdit = () => {
//     form.resetFields();
//     form.setFieldsValue({
//       registrationOpenDate: moment(data.room.registrationOpenDate),
//       registrationEndDate: moment(data.room.registrationEndDate),
//       priceStep: data.room.priceStep,
//       activeDate: moment(data.room.activeDate),
//       endDate: moment(data.room.endDate),
//       status: data.room.status,
//       modificationBy: data.room.modificationBy,
//     });
//     setIsEditing(false);
//   };

//   if (loading) {
//     return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
//   }

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '20px' }}>
//       <div style={{ flex: 2 }}>
//         <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT CUỘC ĐẤU GIÁ</Title>
//         <Card>
//           <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
//             <Form.Item label="Id Phòng đấu giá" className="blurred-field">
//               <Input value={data.room.roomId || ''} readOnly />
//             </Form.Item>
//             <Form.Item name="registrationOpenDate" label="Ngày mở đăng ký" rules={[{ required: true, message: 'Please select a date' }]}>
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="registrationEndDate" label="Ngày đóng đăng ký" rules={[{ required: true, message: 'Please select a date' }]}>
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item label="Phí đăng ký" className="blurred-field">
//               <Input value={data.room.registrationFee || ''} readOnly />
//             </Form.Item>
//             <Form.Item name="priceStep" label="Mức đấu giá" rules={[{ required: true, message: 'Please enter a price step' }]}>
//               <Input disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item label="Ngày tạo cuộc đấu giá" className="blurred-field">
//               <Input value={new Date(data.room.creationDate).toLocaleString() || ''} readOnly />
//             </Form.Item>
//             <Form.Item name="activeDate" label="Thời gian diễn ra" rules={[{ required: true, message: 'Please select a date' }]}>
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item name="endDate" label="Thời gian kết thúc" rules={[{ required: true, message: 'Please select a date' }]}>
//               <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabled={!isEditing} />
//             </Form.Item>
//             <Form.Item label="Thời gian sửa đổi lần cuối" className="blurred-field">
//               <Input value={new Date(data.room.modificationDate).toLocaleString() || ''} readOnly />
//             </Form.Item>
//             <Form.Item name="status" label="Trạng thái cuộc đấu giá" rules={[{ required: true, message: 'Please select a status' }]}>
//               <Select placeholder="Select status" disabled={!isEditing}>
//                 <Option value={1}>Chờ xác nhận</Option>
//                 <Option value={2}>Đang hoạt động</Option>
//                 <Option value={3}>Đấu giá thành công</Option>
//                 <Option value={4}>Đấu giá thất bại</Option>
//                 <Option value={5}>Đã hủy</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//               {isEditing ? (
//                 <>
//                   <Button type="primary" onClick={handleUpdate} style={{ marginRight: '10px' }}>
//                     Cập nhật
//                   </Button>
//                   <Button onClick={handleCancelEdit}>
//                     Hủy
//                   </Button>
//                 </>
//               ) : (
//                 <Button type="primary" onClick={toggleEdit} style={{ width: '100%' }}>
//                   Chỉnh sửa
//                 </Button>
//               )}
//             </Form.Item>
//           </Form>
//         </Card>
//       </div>
//       <div style={{ flex: 1 }}>
//         <Title level={3} style={{ textAlign: 'center' }}>THÔNG TIN CÂY ĐẤU GIÁ</Title>
//         <Card style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
//             <Form.Item label="Tên cây">
//               <Input value={data.room.plant.plantName || ''} readOnly />
//             </Form.Item>
//             <Form.Item label="Tiêu đề">
//               <Input value={data.room.plant.title || ''} readOnly />
//             </Form.Item>
//             <Form.Item label="Mô tả">
//               <Input.TextArea value={data.room.plant.description || ''} readOnly />
//             </Form.Item>
//             <Form.Item label="Hình ảnh: ">
//               {/* <a href={data.room.plant.mainImage} target="_blank" rel="noopener noreferrer">
//                 Xem ảnh
//               </a> */}
//               <Image
//                 src={data.room.plant.mainImage}
//                 alt="Plant Image"
//                 width={200}
//                 style={{ marginBottom: '10px' }}
//               />
//             </Form.Item>
//             <Form.Item label="Giá">
//               <Input value={data.room.plant.finalPrice || ''} readOnly />
//             </Form.Item>
//             {/* <Form.Item label="Loại cây">
//               <Input value={data.room.plant.categoryId || ''} readOnly />
//             </Form.Item> */}
//             <Form.Item label="Hình thức">
//               <Input
//                 value={
//                   data.room.plant.typeEcommerceId === 1
//                     ? 'Cây bán'
//                     : data.room.plant.typeEcommerceId === 2
//                     ? 'Cây thuê'
//                     : data.room.plant.typeEcommerceId === 3
//                     ? 'Cây đấu giá'
//                     : 'Không xác định'
//                 }
//                 readOnly
//               />
//             </Form.Item>
//             <Form.Item label="Trạng thái">
//               <Input value={data.room.plant.isActive === true ? 'Có thể đặt mua / thuê / mang vào đấu giá.' : 'Không thể thuê, mua, đấu giá.'} readOnly />
//             </Form.Item>
//             {/* <Form.Item label="Trạng thái của cây">
//               <Input value={data.room.plant.status === 1 ? 'Đã tạo.' : 'Đã hủy.'} readOnly />
//             </Form.Item> */}
//             <Form.Item label="Ngày tạo cây">
//               <Input value={new Date(data.room.plant.creationDate).toLocaleString() || ''} readOnly />
//             </Form.Item>
//             {/* <Form.Item label="Mã cây">
//               <Input value={data.room.plant.code || ''} readOnly />
//             </Form.Item> */}
//           </Form>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AuctionDetails;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Typography, Card, Spin, message, DatePicker, Select, Image } from 'antd';
import moment from 'moment';
import { getAuctionDetails } from '../../../api/auctionManagement';

const { Title } = Typography;
const { Option } = Select;

const AuctionDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAuctionDetails = async (id) => {
      try {
        const { data } = await getAuctionDetails(id);
        setData(data);
        form.setFieldsValue({
          registrationOpenDate: moment(data.room.registrationOpenDate),
          registrationEndDate: moment(data.room.registrationEndDate),
          priceStep: data.room.priceStep,
          activeDate: moment(data.room.activeDate),
          endDate: moment(data.room.endDate),
          status: data.room.status,
          modificationBy: data.room.modificationBy,
        });
      } catch (error) {
        console.error('Error fetching auction details:', error);
        message.error('Error fetching auction details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionDetails(id);
    }
  }, [id, form]);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <Title level={3} style={{ textAlign: 'center' }}>CHI TIẾT CUỘC ĐẤU GIÁ</Title>
        <Card>
          <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
            <Form.Item label="Id Phòng đấu giá">
              <Input value={data.room.roomId || ''} readOnly />
            </Form.Item>
            <Form.Item label="Ngày mở đăng ký">
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={moment(data.room.registrationOpenDate)} disabled />
            </Form.Item>
            <Form.Item label="Ngày đóng đăng ký">
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={moment(data.room.registrationEndDate)} disabled />
            </Form.Item>
            <Form.Item label="Phí đăng ký">
              <Input value={data.room.registrationFee || ''} readOnly />
            </Form.Item>
            <Form.Item label="Mức đấu giá">
              <Input value={data.room.priceStep || ''} readOnly />
            </Form.Item>
            {/* <Form.Item label="Ngày tạo cuộc đấu giá">
              <Input value={new Date(data.room.creationDate).toLocaleString() || ''} readOnly />
            </Form.Item> */}
            <Form.Item label="Thời gian diễn ra">
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={moment(data.room.activeDate)} disabled />
            </Form.Item>
            <Form.Item label="Thời gian kết thúc">
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime value={moment(data.room.endDate)} disabled />
            </Form.Item>
            {/* <Form.Item label="Thời gian sửa đổi lần cuối">
              <Input value={new Date(data.room.modificationDate).toLocaleString() || ''} readOnly />
            </Form.Item> */}
            <Form.Item label="Ngày tạo cuộc đấu giá" >
              <Input value={new Date(data.room.creationDate).toLocaleDateString() || ''} readOnly />
            </Form.Item>
            <Form.Item label="Thời gian sửa đổi lần cuối" >
              <Input value={new Date(data.room.modificationDate).toLocaleDateString() || ''} readOnly />
            </Form.Item>
            <Form.Item label="Trạng thái cuộc đấu giá">
              <Select value={data.room.status} disabled>
                <Option value={1}>Chờ xác nhận</Option>
                <Option value={2}>Đang hoạt động</Option>
                <Option value={3}>Đấu giá thành công</Option>
                <Option value={4}>Đấu giá thất bại</Option>
                <Option value={5}>Đã hủy</Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        <Title level={3} style={{ textAlign: 'center' }}>THÔNG TIN CÂY ĐẤU GIÁ</Title>
        <Card style={{ width: '100%', borderCollapse: 'collapse' }}>
          <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
            <Form.Item label="Tên cây">
              <Input value={data.room.plant.plantName || ''} readOnly />
            </Form.Item>
            <Form.Item label="Tiêu đề">
              <Input value={data.room.plant.title || ''} readOnly />
            </Form.Item>
            <Form.Item label="Mô tả">
              <Input.TextArea value={data.room.plant.description || ''} readOnly />
            </Form.Item>
            <Form.Item label="Hình ảnh: ">
              <Image
                src={data.room.plant.mainImage}
                alt="Plant Image"
                width={200}
                style={{ marginBottom: '10px' }}
              />
            </Form.Item>
            <Form.Item label="Giá">
              <Input value={data.room.plant.finalPrice || ''} readOnly />
            </Form.Item>
            <Form.Item label="Hình thức">
              <Input
                value={
                  data.room.plant.typeEcommerceId === 1
                    ? 'Cây bán'
                    : data.room.plant.typeEcommerceId === 2
                    ? 'Cây thuê'
                    : data.room.plant.typeEcommerceId === 3
                    ? 'Cây đấu giá'
                    : 'Không xác định'
                }
                readOnly
              />
            </Form.Item>
            <Form.Item label="Trạng thái">
              <Input value={data.room.plant.isActive === true ? 'Có thể đặt mua / thuê / mang vào đấu giá.' : 'Không thể thuê, mua, đấu giá.'} readOnly />
            </Form.Item>
            <Form.Item label="Ngày tạo cây">
              <Input value={new Date(data.room.plant.creationDate).toLocaleString() || ''} readOnly />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AuctionDetails;
