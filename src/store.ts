import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import client from "./slices/client";
import notes from "./slices/notes";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { resetApp } from "./slices";
import notebook from "./slices/notebook";

// 使用 combineReducers 将多个 reducer 组合成一个
const rootReducer = combineReducers({
  user: user.reducer,
  folders: folders.reducer,
  notes: notes.reducer,
  client: client.reducer,
  notebook: notebook.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});
async function logout() {
  store.dispatch(resetApp());
  await signOut(auth);
}
export type RootState = ReturnType<typeof rootReducer>;
export { store, logout };
