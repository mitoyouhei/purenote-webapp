import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import note from "./slices/note";
import client from "./slices/client";

const store = configureStore({
  reducer: {
    user: user.reducer,
    folders: folders.reducer,
    note: note.reducer,
    client: client.reducer,
  },
});

export { store };
