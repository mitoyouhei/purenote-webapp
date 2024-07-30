// src/components/Login.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, connectSocket } from "../websocket";
import { store } from "../store";
import { setUser } from "../slices/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
    <div
      className="container my-5"
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            ref={inputRef}
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
    </div>
  );
};

export default Login;
