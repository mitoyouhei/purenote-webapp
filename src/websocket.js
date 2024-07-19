import { store } from "./store";
import { setUser } from "./slices/user";
import { setFolders } from "./slices/folders";
import { addFolderSuccess } from "./actions";
import { io } from "socket.io-client";

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

  socket.onAny((event, ...args) => {
    console.log(`Received event: ${event}`, args);
  });

  socket.onmessage = (event) => {
    console.log("Received message:", event);
    const data = JSON.parse(event.data);
    if (data.status === "success" && data.folder) {
      store.dispatch(addFolderSuccess(data.folder));
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
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

  if (error) {
    throw error;
  }

  return note;
}
export async function updateNote(folderId, content) {
  socket.emit("updateNote", folderId, content);
}

export async function addFolder(name, parentId) {
  return socket.emit("addFolder", name, parentId);
}
export async function addNote(name, parentId) {
  return socket.emit("addNote", name, parentId, "");
}
export async function deleteFolder(folderId) {
  return socket.emit("deleteFolder", folderId);
}
export default socket;
