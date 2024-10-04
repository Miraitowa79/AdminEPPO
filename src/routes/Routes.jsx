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
// import AccountDetails from "@pages/home/accountManagement.jsx";
// import Verify from '@pages/auth/Login.jsx'

const authRoutes = {
  path: "/auth",
  element: <LayoutAuth />,
  guard: <UnauthRoute />,
  children: [
    {
      path: "login",
      element: <Login />,
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
  
  ],
};

const staffRoutes = {
  path: "/staff",
  element: <MainLayout />,
  guard: <StaffRoute />,
  children: [
    {
      path: "products-management",
      element: <>this is a staff page</>,
    }
  ],
};

const adminRoutes = {
  path: "/admin",
  element: <MainLayout />,
  guard: <AdminRoute />,
  children: [
    {
      path: "users-management",
      element: <>this is a admin page</>,
    }
  ],
};

const managerRoutes = {
  path: "/manager",
  element: <MainLayout />,
  guard: <ManagerRoute />,
  children: [
    {
      path: "auction-management",
      element: <>this is a manager page</>,
    }
  ],
};

const chatMessage = {
  path: "/chat",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "support",
      element: <ChatMessage />,
    }
  ],
};

const dashboard = {
  path: "/dashboard",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "",
      element: <Dashboard />,
    }
  ],
};

const accountManagement = {
  path: "/account",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "",
      element: <AccountManagement />,
    }
  ],
};

const contractManagement = {
  path: "/contract",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "",
      element: <ContractManagement />,
    }
  ],
};

const plantsManagement = {
  path: "/product",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "plants",
      element: <PlantstManagement />,
    }
  ],
};

const profile = {
  path: "/profile",
  element: <MainLayout />,
  guard: <AuthRoute />,
  children: [
    {
      path: "",
      element: <Profile />,
    }
  ],
};

// const accountDetails = {
//   path: "/account",
//   element: <MainLayout />,
//   guard: <AuthRoute />,
//   children: [
//     {
//       path: "detail",
//       element: <AccountDetails />,
//     }
//   ],
// };

// const verify = {
//   path: "/auth",
//   element: <LayoutAuth />,
//   guard: <UnauthRoute />,
//   children: [
//     {
//       path: "verify",
//       element: <Verify />,
//     },
//   ],
// };

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

const routes = [authRoutes, notfoundRoute, homeRoutes,adminRoutes, staffRoutes, managerRoutes, chatMessage, dashboard, accountManagement, contractManagement, plantsManagement,
  profile
];

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
