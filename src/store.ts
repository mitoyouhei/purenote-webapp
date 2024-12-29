import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import client from "./slices/client";
import notes from "./slices/notes";
import { resetApp } from "./slices";
import notebook from "./slices/notebook";
import { supabase } from "./supabase";

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
  await supabase.auth.signOut();
  store.dispatch(resetApp());
}
export type RootState = ReturnType<typeof rootReducer>;
export { store, logout };
