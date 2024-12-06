import { LOGIN_PATH } from "@src/constants/routes";
import {notification} from 'antd'
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser, isTokenExpired } from '@utils'

const roles = [2,3]
const ManagerAndStaffRoute = () => {
  const auth = getAuthUser();
  if (auth?.token && roles.includes(Number(auth?.roleId))) {
    if(!isTokenExpired(auth?.token)){
        return <Outlet />;
      }else{
        localStorage.clear('authUser')
        notification.error({
          duration: 5,
          message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!'
        })
        return <Navigate to={LOGIN_PATH} />;
      }
  }
  notification.warning({
    duration: 5,
    message: 'Yêu cầu bị từ chối!'
  })
  return <Navigate to={'/'} />;
};

export default ManagerAndStaffRoute;