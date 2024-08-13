import { LOGIN_PATH } from "@src/constants/routes";

import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'


const AuthRoute = () => {
  const auth = getAuthUser();
  if (auth?.isLogged) {
    return <Outlet />;
  }
  return <Navigate to={LOGIN_PATH} />;
};

export default AuthRoute;