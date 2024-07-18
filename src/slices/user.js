import { createSlice } from "@reduxjs/toolkit";

const localStorageUser = localStorage.getItem("user");
const initialState = localStorageUser ? JSON.parse(localStorageUser) : {};
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    },
    logout: (state, action) => {
      localStorage.removeItem("user");
      window.location.reload();
      return {};
    },
  },
});

export const { setUser, logout } = user.actions;
export default user;
