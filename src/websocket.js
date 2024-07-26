import { store } from "./store";
import { setUser, logout } from "./slices/user";
import { setFolders } from "./slices/folders";
import { io } from "socket.io-client";
import { setSocketConnected } from "./slices/client";
import { globalErrorHandler } from "./errorHandler";

let socket = null;
connectSocket();

export function connectSocket() {
  const token = store.getState().user.token;
  socket = io("ws://localhost:5002", {
    reconnectionDelayMax: 50000,
    // transports: ["websocket"],
    auth: { token },
  });
  socket.on("userInfo", (userInfo) => {
    store.dispatch(setUser(userInfo));
  });
  socket.on("folders", (folders) => {
    store.dispatch(setFolders(folders));
  });
  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.on("error", (error) => {
    // store.dispatch(setUser(userInfo));
    console.error("socket error", error);
    if (error?.errorCode === 401) {
      store.dispatch(logout());
    }
  });
  socket.onAny((event, ...args) => {
    console.log(`Received event: ${event}`, args);
  });
  socket.on("connect_error", (error) => {
    // console.log("Connection error:", error);
    store.dispatch(setSocketConnected(false));
    globalErrorHandler(error, "socket connect_error");
  });
  // socket.onmessage = (event) => {
  //   console.log("Received message:", event);
  //   const data = JSON.parse(event.data);
  //   if (data.status === "success" && data.folder) {
  //     store.dispatch(addFolderSuccess(data.folder));
  //   }
  // };

  socket.on("connect", () => {
    console.log("Connected to the server");
    store.dispatch(setSocketConnected(true));
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
    store.dispatch(setSocketConnected(false));
  });

  socket.on("reconnect_attempt", () => {
    console.log("Attempting to reconnect...");
    store.dispatch(setSocketConnected(false));
  });

  socket.on("reconnect_failed", () => {
    console.error("Reconnection failed.");
    store.dispatch(setSocketConnected(false));
  });

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    // store.dispatch(setSocketConnected(false));
  };
}

export async function login(username, password) {
  const { token, error } = await socket
    .timeout(5000)
    .emitWithAck("login", username, password);

  if (error) {
    throw error;
  }

  return token;
}

export async function refreshToken(token) {
  const { newToken, error } = await socket
    .timeout(5000)
    .emitWithAck("refreshToken", token);

  if (error) {
    throw error;
  }

  return newToken;
}
export async function getNote(folderId) {
  const { note, error } = await socket
    .timeout(5000)
    .emitWithAck("getNote", folderId);

  if (error?.errorCode === "noteNotExist") return null;
  if (error) {
    throw error;
  }

  return note;
}
export async function updateNote(folderId, content) {
  socket.emit("updateNote", folderId, content);
}
export async function updateNoteTitle(folderId, title) {
  socket.emit("updateNoteTitle", folderId, title);
}

export async function addFolder(name, parentId) {
  return socket.emit("addFolder", name, parentId);
}
export async function addNote(name, parentId) {
  const { note, folder, error } = await socket
    .timeout(5000)
    .emitWithAck("addNote", name, parentId, "");

  if (error) {
    throw error;
  }

  return { note, folder };
}

export async function deleteFolder(folderId) {
  const { error } = await socket
    .timeout(5000)
    .emitWithAck("deleteFolder", folderId);

  if (error) {
    throw error;
  }
}
export default socket;
