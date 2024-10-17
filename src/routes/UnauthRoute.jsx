
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'

const UnauthRoute = () => {
  const auth = getAuthUser();
  if (!auth?.token) {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default UnauthRoute;