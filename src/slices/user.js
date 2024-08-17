import { createSlice } from "@reduxjs/toolkit";

const localStorageUser = localStorage.getItem("user");
const initialState = localStorageUser ? JSON.parse(localStorageUser) : null;
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    },
    logout: (state, action) => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { setUser, logout } = user.actions;
export default user;
