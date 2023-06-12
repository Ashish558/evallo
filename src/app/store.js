import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { sessionServicesApi } from "./services/session";
import { authServicesApi } from "./services/auth";
import { userServicesApi } from "./services/users";
import { testServicesApi } from "./services/test";
import { dashboardServicesApi } from "./services/dashboard";
import { settingsServicesApi } from "./services/settings";
import { adminServicesApi } from "./services/admin";

import userReducer from './slices/user'
import organizationReducer from './slices/organization'

export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    [sessionServicesApi.reducerPath]: sessionServicesApi.reducer,
    [authServicesApi.reducerPath]: authServicesApi.reducer,
    [userServicesApi.reducerPath]: userServicesApi.reducer,
    [testServicesApi.reducerPath]: testServicesApi.reducer,
    [dashboardServicesApi.reducerPath]: dashboardServicesApi.reducer,
    [settingsServicesApi.reducerPath]: settingsServicesApi.reducer,
    [adminServicesApi.reducerPath]: adminServicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sessionServicesApi.middleware,
      authServicesApi.middleware,
      userServicesApi.middleware,
      testServicesApi.middleware,
      dashboardServicesApi.middleware,
      settingsServicesApi.middleware,
      adminServicesApi.middleware,
    ),
});

setupListeners(store.dispatch);
