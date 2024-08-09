import { createSlice } from "@reduxjs/toolkit";


const localStorageNoteSiderbarWidth = localStorage.getItem("noteSiderbarWidth");

const initialState = {
  socketConnected: false,
  errorMessage: null,
  noteSiderbarWidth: localStorageNoteSiderbarWidth
    ? parseInt(localStorageNoteSiderbarWidth)
    : 300,
};
const client = createSlice({
  name: "client",
  initialState,
  reducers: {
    setNoteSiderbarWidth: (state, action) => {
      localStorage.setItem("noteSiderbarWidth", JSON.stringify(action.payload));
      return {
        ...state,
        noteSiderbarWidth: action.payload,
      };
    },
    setSocketConnected: (state, action) => {
      return {
        ...state,
        socketConnected: action.payload,
      };
    },
    setErrorMessage: (state, action) => {
      return {
        ...state,
        errorMessage: action.payload,
      };
    },
  },
});

export const { setSocketConnected, setErrorMessage, setNoteSiderbarWidth } =
  client.actions;
export default client;
