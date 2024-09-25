import { LOGIN_PATH } from "@src/constants/routes";

import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'


const AdminRoute = () => {
  const auth = getAuthUser();
  if (auth?.isLogged && auth?.role == 'admin') {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default AdminRoute;