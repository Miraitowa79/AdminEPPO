import {  configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "./auth/slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
