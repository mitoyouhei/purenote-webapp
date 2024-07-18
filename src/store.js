import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";

const store = configureStore({
  reducer: {
    user: user.reducer,
    folders: folders.reducer,
  },
});

export { store };
