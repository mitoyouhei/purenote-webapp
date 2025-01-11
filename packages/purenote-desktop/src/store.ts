import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import { notesReducer, clientReducer, notebookReducer, RESET_APP } from "purenote-core";
import { supabase } from "purenote-core";

// 使用 combineReducers 将多个 reducer 组合成一个
const rootReducer = combineReducers({
  user: user.reducer,
  folders: folders.reducer,
  notes: notesReducer,
  client: clientReducer,
  notebook: notebookReducer,
});

const store = configureStore({
  reducer: rootReducer,
});
async function logout() {
  store.dispatch({ type: RESET_APP });
  await supabase.auth.signOut();
}
export type RootState = ReturnType<typeof rootReducer>;
export { store, logout };
