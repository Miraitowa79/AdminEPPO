
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from '@utils'

const UnauthRoute = () => {
  const auth = getAuthUser();
  if (!auth?.isLogged) {
    return <Outlet />;
  }
  return <Navigate to={'/'} />;
};

export default UnauthRoute;