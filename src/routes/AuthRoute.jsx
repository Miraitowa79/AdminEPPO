import { LOGIN_PATH } from "@src/constants/routes";
import { notification } from 'antd'
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser, isTokenExpired } from '@utils'

const AuthRoute = () => {
  const auth = getAuthUser();
  if (auth?.token) {
    if(!isTokenExpired(auth?.token)){
      if(auth?.roleId == 5){
        localStorage.clear('authUser')
        notification.error({
          duration: 5,
          message: 'Yêu cầu bị từ chối, vui lòng sử dụng tài khoản khác!'
        })
        return <Navigate to={LOGIN_PATH} />;
      }
      return <Outlet />;
    }else{
      localStorage.clear('authUser')
      notification.error({
        duration: 5,
        message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!'
      })
    }
  }
  return <Navigate to={LOGIN_PATH} />;
};

export default AuthRoute;