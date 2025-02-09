import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";

export const appStore = configureStore({
  reducer: {
    auth: rootReducer,
    [authApi.reducerPath]: authApi.reducer, // Add the reducer for RTK Query
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware
    ),
});

const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

initializeApp();
