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
import AccountManagement from "@pages/home/manager/accountManagement.jsx";
import ContractManagement from "@pages/home/staff/contractManagement.jsx";
import PlantstManagement from "@pages/home/manager/plantsManagement.jsx";
import Profile from "@pages/home/profile.jsx";
import AccountDetails from "@pages/home/manager/accountDetails.jsx";
import Verify from '@pages/auth/verifyAccount.jsx'
import ContractId from "@pages/home/staff/contractId.jsx";
import AdminAndManagerRoute from "./AdminAndManager.jsx";
import ManagerAndStaffRoutes from "./ManagerAndStaff.jsx";
import CreateAccount from "@pages/home/manager/createAccount.jsx";
import PlantDetails from "@pages/home/manager/plantDetails.jsx";
import FeedbackMng from "@pages/home/staff/feedbackManagement.jsx";
import FeedbackDetails from "@pages/home/staff/feedbackDetails.jsx";
import AuctionMng from "@pages/home/staff/auctionManagement.jsx";
import AuctionDetails from "@pages/home/staff/auctionDetails.jsx";
import AuctionCreate from "@pages/home/staff/auctionCreate.jsx";
import AuctionMnger from "@pages/home/manager/auctionMnger.jsx";
import AuctionMngerDetails from "@pages/home/manager/auctionMngerDetails.jsx";
import OrdersMng from "@pages/home/staff/orderMngStaff.jsx";
import OrderDetails from "@pages/home/staff/orderDetailStaff.jsx";
import FeedbackListMnger from "@pages/home/manager/feedbackList.jsx";
import FeedbackDetailsMnger from "@pages/home/manager/feedbackDetailsMnger.jsx";
import ContractList from "@pages/home/manager/contractList.jsx";
import ContractDetails from "@pages/home/manager/contractDetails.jsx";



/* Manager list manager of the function */
import PlantsRenting from "../pages/home/manager/plantsRentingManager.jsx";
import PlantsAuction from "../pages/home/manager/plantsAuctionManager.jsx";
import PlantRentingDetails from "../pages/home/manager/plantRentingDetails.jsx";
import PlantAuctionDetails from './../pages/home/manager/plantAuctionDetails.jsx';
import PlantSaleDetails from './../pages/home/manager/plantSaleDetails.jsx';




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
    {
      path: 'auction',
      element: <AuctionMng />
    },
    {
      path: 'auction/:id',
      element: <AuctionDetails />
    },
    {
      path: 'auction/create',
      element: <AuctionCreate />,
      guard: <StaffRoute />
    },
    {
      path: "orders",
      element: <OrdersMng/>
    },
    {
      path: 'orders/:id',
      element:  <OrderDetails />
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
      path: "contract",
      element: <ContractManagement/>
    },
    {
      path: 'contract/:id',
      element:  <ContractId />
    }
  ],
};

const managerRoutes = {
  path: "/manager",
  element: <MainLayout />,
  guard: <ManagerRoute />,
  children: [
    {
      path: "products/plants/sales",
      element:  <PlantstManagement />,
    },
    {
      path: "products/plants/renting",
      element:  <PlantsRenting />,
    },
    {
      path: "products/plants/auction",
      element:  <PlantsAuction />,
    },
    {
      path: "products/plants/:id",
      element:  <PlantDetails />,
    },
    {
      path: "products/plants/sale/:id",
      element:  <PlantSaleDetails/>,
    },
    {
      path: "products/plants/renting/:id",
      element:  <PlantRentingDetails />,
    },
    {
      path: "products/plants/auction/:id",
      element:  <PlantAuctionDetails />,
    },
    {
      path: 'auction',
      element: <AuctionMnger />
    },
    {
      path: 'auction/:id',
      element: <AuctionMngerDetails />
    },
    {
      path: 'feedback',
      element: <FeedbackListMnger />
    },
    {
      path: 'feedback/:id',
      element: <FeedbackDetailsMnger />
    },
    {
      path: "contract",
      element: <ContractList/>
    },
    {
      path: 'contract/:id',
      element:  <ContractDetails />
    }
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
