import React, { Suspense } from "react";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import UnauthRoute from "./UnauthRoute.jsx";
import AuthRoute from "./AuthRoute.jsx";
import LayoutAuth from "@layouts/auth/AuthLayout.jsx";
import HomePage from "@pages/home/index.jsx";
import Login from '@pages/auth/Login.jsx'
import MainLayout from "@layouts/MainLayout.jsx";
import PageNotFound from "@pages/system/PageNotFound.jsx";

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
      path: "c/:groupId",
      element: <HomePage />,
    },
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
const routes = [authRoutes, notfoundRoute, homeRoutes];

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
