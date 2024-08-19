import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localforage from "localforage"; // 引入 localforage
import user from "./slices/user";
import folders from "./slices/folders";
import client from "./slices/client";
import notes from "./slices/notes";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { resetApp } from "./slices";

localforage.config({
  driver: localforage.INDEXEDDB, // 使用 IndexedDB 作为首选驱动
  name: "purenote-database",
  version: 1.0,
  storeName: "reduxState", // 存储名称
});

// 使用 combineReducers 将多个 reducer 组合成一个
const rootReducer = combineReducers({
  user: user.reducer,
  folders: folders.reducer,
  notes: notes.reducer,
  client: client.reducer,
});

// 配置持久化，并指定 localforage 作为存储引擎
const persistConfig = {
  key: "purenote",
  storage: localforage, // 使用 localforage，优先使用 IndexedDB
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // 忽略 redux-persist 特定的 action
      },
    }),
});

const persistor = persistStore(store);

async function logout() {
  store.dispatch(resetApp());
  await signOut(auth);
}

export { store, persistor, logout };
