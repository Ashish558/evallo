import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { sessionServicesApi } from "./services/session";
import { authServicesApi } from "./services/auth";
import { userServicesApi } from "./services/users";
import { testServicesApi } from "./services/test";
import { dashboardServicesApi } from "./services/dashboard";
import { settingsServicesApi } from "./services/settings";
import { adminServicesApi } from "./services/admin";
import { orgServicesApi } from "./services/organization";
import { superAdminServicesApi } from "./services/superAdmin";
import userReducer from './slices/user'
import organizationReducer from './slices/organization'
import subscriptionUIReducer from "./slices/subscriptionUI";
import { adminDashboardServicesApi } from "./services/adminDashboard";
import { orgSignupApi } from "./services/orgSignup";
import { subscriptionApi } from "./services/subscription";
import subscription from "./slices/subscription";

export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    subscriptionUI: subscriptionUIReducer,
    subscription: subscription,
    [sessionServicesApi.reducerPath]: sessionServicesApi.reducer,
    [authServicesApi.reducerPath]: authServicesApi.reducer,
    [userServicesApi.reducerPath]: userServicesApi.reducer,
    [testServicesApi.reducerPath]: testServicesApi.reducer,
    [dashboardServicesApi.reducerPath]: dashboardServicesApi.reducer,
    [settingsServicesApi.reducerPath]: settingsServicesApi.reducer,
    [adminServicesApi.reducerPath]: adminServicesApi.reducer,
    [orgServicesApi.reducerPath]: orgServicesApi.reducer,
    [superAdminServicesApi.reducerPath]: superAdminServicesApi.reducer,
    [adminDashboardServicesApi.reducerPath]: adminDashboardServicesApi.reducer,
    [orgSignupApi.reducerPath]: orgSignupApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
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
      orgServicesApi.middleware,
      superAdminServicesApi.middleware, 
      adminDashboardServicesApi.middleware,
      orgSignupApi.middleware,
      subscriptionApi.middleware,
    ),
});

setupListeners(store.dispatch);
