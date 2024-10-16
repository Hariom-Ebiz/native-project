import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import siteReducer from "./siteSlice";
import authReducer from "./authSlice";

const makeStore = (context) =>
  configureStore({
    reducer: {
      site: siteReducer,
      auth: authReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
