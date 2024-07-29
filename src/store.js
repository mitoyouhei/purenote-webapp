import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import folders from "./slices/folders";
import client from "./slices/client";
import notes from "./slices/notes";

const store = configureStore({
  reducer: {
    user: user.reducer,
    folders: folders.reducer,
    notes: notes.reducer,
    client: client.reducer,
  },
});

export { store };
