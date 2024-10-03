import axios from "axios";

import { getAuthUser } from "@utils/index";
import { modalNoti } from "@utils/Notification";

let store;

export const BASE_URL = process.env.REACT_APP_BASE_URL_AUTH;

export const injectStore = (_store) => (store = _store);

export const baseApi = (baseUrl) => {
  const baseClient = axios.create({
    baseURL: baseUrl ? baseUrl : BASE_URL,
    withCredentials: true,
  });

  baseClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log("err:::", error);
      if (!error?.response) {
        return Promise.reject({
          ...error,
          response: {
            status: 500,
            message: "Please check your network",
          },
        });
      }
    }
  );

  baseClient.interceptors.request.use((config) => {
    const user = getAuthUser();
    config.headers.Authorization = "Bearer " + user?.token;
    return config;
  });

  return baseClient;
};
