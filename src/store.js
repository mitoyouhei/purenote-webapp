import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import note from "./slices/note";

const store = configureStore({
  reducer: {
    user: user.reducer,
    folders: folders.reducer,
    note: note.reducer,
  },
});

export { store };
