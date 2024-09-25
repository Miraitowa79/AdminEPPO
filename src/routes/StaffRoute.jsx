import { LOGIN_PATH } from "@src/constants/routes";

import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'


const StaffRoute = () => {
  const auth = getAuthUser();
  if (auth?.isLogged && auth?.role == 'staff') {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default StaffRoute;