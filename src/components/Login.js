// src/components/Login.js
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { loginUser } from "../actions";
import { login, connectSocket } from "../websocket";
import { store } from "../store";
import { setUser } from "../slices/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await login(username, password);
    console.log("login success", token);
    store.dispatch(setUser({ token }));
    connectSocket();
    navigate("/");
    // dispatch(loginUser(username, password)).then(() => {
    //   navigate("/");
    // });
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="email"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
