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
          message: 'Permission denied, pls use another account!'
        })
        return <Navigate to={LOGIN_PATH} />;
      }
      return <Outlet />;
    }else{
      localStorage.clear('authUser')
      notification.error({
        duration: 5,
        message: 'Token is expired, pls login again!'
      })
    }
  }
  return <Navigate to={LOGIN_PATH} />;
};

export default AuthRoute;