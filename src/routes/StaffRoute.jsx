import { LOGIN_PATH } from "@src/constants/routes";
import { notification} from 'antd'
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser, isTokenExpired } from '@utils'


const StaffRoute = () => {
  const auth = getAuthUser();
  if (auth?.token && auth?.roleId == 3) {
    if(!isTokenExpired(auth?.token)){
      return <Outlet />;
    }else{
      localStorage.clear('authUser')
      notification.error({
        duration: 5,
        message: 'Token is expired, pls login again!'
      })
      return <Navigate to={LOGIN_PATH} />;
    }
  }
  setTimeout(() => {
    notification.warning({
      duration: 5,
      message: 'Permission denined!'
    })
  })

  return <Navigate to={'/'} />;
};

export default StaffRoute;