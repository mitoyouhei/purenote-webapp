import axios from "axios";

export const addNote = (content, folder_id) => ({
  type: "ADD_NOTE",
  payload: { content, folder_id },
});

export const addFolder = (name, parent_id) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:5002/api/folders",
      { name, parent_id },
      { withCredentials: true }
    );
    dispatch(addFolderSuccess(response.data));
  } catch (error) {
    dispatch({ type: "ADD_FOLDER_FAIL", payload: error.response.data });
  }
};

export const addFolderSuccess = (folder) => ({
  type: "ADD_FOLDER_SUCCESS",
  payload: folder,
});

export const deleteFolder = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5002/api/folders/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: "DELETE_FOLDER", payload: id });
  } catch (error) {
    dispatch({ type: "DELETE_FOLDER_FAIL", payload: error.response.data });
  }
};

export const registerUser = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5002/api/register", {
      username,
      password,
    });
    dispatch({ type: "REGISTER_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "REGISTER_FAIL", payload: error.response.data });
  }
};

export const loginUser = (username, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:5002/auth/login",
      { username, password },
      { withCredentials: true }
    );
    const user = response.data.user;
    localStorage.setItem("user", JSON.stringify(user)); // 存储用户信息到 localStorage
    dispatch({ type: "LOGIN_SUCCESS", payload: user });
  } catch (error) {
    dispatch({ type: "LOGIN_FAIL", payload: error.response.data });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:5002/api/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("user"); // 从 localStorage 中移除用户信息
    dispatch({ type: "LOGOUT_SUCCESS" });
  } catch (error) {
    dispatch({ type: "LOGOUT_FAIL", payload: error.response.data });
  }
};
