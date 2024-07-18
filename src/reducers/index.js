import { combineReducers } from "redux";

const initialState = {
  isAuthenticated: !!localStorage.getItem("user"),
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const notes = (state = [], action) => {
  switch (action.type) {
    case "ADD_NOTE":
      return [
        ...state,
        {
          content: action.payload.content,
          folder_id: action.payload.folder_id,
        },
      ];
    default:
      return state;
  }
};

const folders = (state = [], action) => {
  switch (action.type) {
    case "ADD_FOLDER":
      return state; // 请求发送到服务器时，不立即更新状态
    case "ADD_FOLDER_SUCCESS":
      return [...state, action.payload];
    case "DELETE_FOLDER":
      return state.filter((folder) => folder._id !== action.payload);
    default:
      return state;
  }
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      return { isAuthenticated: true, user: action.payload };
    case "LOGOUT_SUCCESS":
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export default combineReducers({
  notes,
  folders,
  user,
});
