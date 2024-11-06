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
import AdminAndManagerRoute from "./AdminAndManager.jsx";
import ManagerAndStaffRoutes from "./ManagerAndStaff.jsx";
import CreateAccount from "@pages/home/createAccount.jsx";
import PlantDetails from "@pages/home/plantDetails.jsx";
import FeedbackMng from "@pages/home/feedbackManagement.jsx";
import FeedbackDetails from "@pages/home/feedbackDetails.jsx";
import AuctionMng from "@pages/home/auctionManagement.jsx";
import AuctionDetails from "@pages/home/auctionDetails.jsx";

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
      path: "list/users/create-account",
      element: <CreateAccount/>,
    },
  ],
};

const staffRoutes = {
  path: "/staff",
  element: <MainLayout />,
  guard: <StaffRoute />,
  children: [
    // {
    //   path: "contract",
    //   element: <ContractManagement/>,
    //   guard: <StaffRoute />
    // },
    // {
    //   path: 'contract/:id',
    //   element:  <ContractId />
    // },
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
    {
      path: "products/plants/:id",
      element:  <PlantDetails />,
    },
  ],
};

const adminAndManagerRoutes = {
  path: "/list",
  element: <MainLayout />,
  guard: <AdminAndManagerRoute />,
  children: [
    {
      path: "users",
      element: <AccountManagement/>,
    },
    {
      path: 'users/:userId',
      element: <AccountDetails />
    },
  ],
};

const managerAndStaffRoutes = {
  path: "/management",
  element: <MainLayout />,
  guard: <ManagerAndStaffRoutes />,
  children: [
    {
      path: "chat",
      element: <ChatMessage/>,
    },
    {
      path: "contract",
      element: <ContractManagement/>
    },
    {
      path: 'contract/:id',
      element:  <ContractId />
    },
    {
      path: 'feedback',
      element: <FeedbackMng />
    },
    {
      path: 'feedback/:id',
      element: <FeedbackDetails />
    },
    {
      path: 'auction',
      element: <AuctionMng />
    },
    {
      path: 'auction/:id',
      element: <AuctionDetails />
    }
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

const routes = [authRoutes, notfoundRoute, homeRoutes,adminRoutes, staffRoutes, managerRoutes, adminAndManagerRoutes, managerAndStaffRoutes];

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
