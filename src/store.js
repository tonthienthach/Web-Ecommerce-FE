import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

//persit our store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import cartSlice from "./features/cartSlice";
import cateSlice from "./features/cateSlice";
import rateSlice from "./features/rateSlice";
import compareProductSlice from "./features/compareProductSlice";
// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

//reducers
const reducer = combineReducers({
  user: userSlice,
  products: productSlice,
  cart: cartSlice,
  category: cateSlice,
  rate: rateSlice,
  compareProduct: compareProductSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  // stateReconciler: autoMergeLevel2,
  blackList: [appApi.reducerPath, "products"],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});

export default store;
