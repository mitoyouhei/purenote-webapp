// src/components/Register.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { register, connectSocket } from "../websocket";
import { store } from "../store";
import { setUser } from "../slices/user";
import { useSelector } from "react-redux";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const user = useSelector((state) => state.user);
  const client = useSelector((state) => state.client);

  useEffect(() => {
    if (user.token && client.socketConnected) {
      navigate("/");
    }
  }, [navigate, user, client]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await register(username, password);
    console.log("register success", token);
    store.dispatch(setUser({ token }));
    connectSocket();
    navigate("/");
  };

  return (
    <div
      className="container my-5"
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Register</h1>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
