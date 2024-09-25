import { LOGIN_PATH } from "@src/constants/routes";

import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'


const ManagerRoute = () => {
  const auth = getAuthUser();
  if (auth?.isLogged && auth?.role == 'manager') {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default ManagerRoute;