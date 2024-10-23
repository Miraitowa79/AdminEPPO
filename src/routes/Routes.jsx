import React, { Suspense } from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import UnauthRoute from "./UnauthRoute.jsx";
import AuthRoute from "./AuthRoute.jsx";
import StaffRoute from "./StaffRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import ManagerRoute from "./ManagerRoute.jsx";
import LayoutAuth from "@layouts/auth/AuthLayout.jsx";
import HomePage from "@pages/home/index.jsx";
import Login from '@pages/auth/Login.jsx'
import MainLayout from "@layouts/MainLayout.jsx";
import PageNotFound from "@pages/system/PageNotFound.jsx";
import ChatMessage from "@pages/home/chat.jsx";
import Dashboard from "@pages/home/dashboard.jsx";
import AccountManagement from "@pages/home/accountManagement.jsx";
import ContractManagement from "@pages/home/contractManagement.jsx";
import PlantstManagement from "@pages/home/plantsManagement.jsx";
import Profile from "@pages/home/profile.jsx";
import AccountDetails from "@pages/home/accountDetails.jsx";
import Verify from '@pages/auth/verifyAccount.jsx'
import ContractId from "@pages/home/contractId.jsx";

const authRoutes = {
  path: "/auth",
  element: <LayoutAuth />,
  guard: <UnauthRoute />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "verify",
      element: <Verify />,
    },
  ],
};

const homeRoutes = {
  path: "/",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "profile",
      element: <Profile/>
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    }
  ],
};

const adminRoutes = {
  path: "/admin",
  element: <MainLayout />,
  guard: <AdminRoute />,
  children: [
    {
      path: "account",
      element: <AccountManagement/>,
    },
    {
      path: 'account/:userId',
      element: <AccountDetails />
    }
  ],
};

const staffRoutes = {
  path: "/staff",
  element: <MainLayout />,
  guard: <StaffRoute />,
  children: [
    {
      path: "contract",
      element: <ContractManagement/>,
      guard: <StaffRoute />
    },
    {
      path: 'contract/:id',
      element:  <ContractId />
    },
    {
      path: 'chat',
      element:  <ChatMessage />
    }
  ],
};

const managerRoutes = {
  path: "/manager",
  element: <MainLayout />,
  guard: <ManagerRoute />,
  children: [
    {
      path: "products/plants",
      element:  <PlantstManagement />,
    },
    // {
    //   path: "plants",
    //   element: <PlantstManagement />,
    // }
  ],
};

const notfoundRoute = {
  path: "*",
  element: <></>,
  children: [
    {
      path: "*",
      element: <PageNotFound/>
    },
  ],
};

const routes = [authRoutes, notfoundRoute, homeRoutes,adminRoutes, staffRoutes, managerRoutes];

const Routes = () => {
  return (
    <Suspense fallback={<div />}>
      <ReactRoutes>
        {routes.map((route) => (
          <Route key={route.path} element={route.guard}>
            <Route path={route.path} element={route.element}>
              {route.children
                ? route.children.map(({ element, path, guard }) => (
                    <Route key={path} element={guard}>
                      <Route path={path} element={element} />
                    </Route>
                  ))
                : null}
            </Route>
          </Route>
        ))}
      </ReactRoutes>
    </Suspense>
  );
};
export default Routes;
