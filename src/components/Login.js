// src/components/Login.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { store } from "../store";
import { setUser } from "../slices/user";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { setGlobalErrorToast } from "../errorHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const client = useSelector((state) => state.client);

  useEffect(() => {
    if (user) {
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

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("login success", userCredential.user);
      store.dispatch(setUser(userCredential.user.toJSON()));
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setGlobalErrorToast("Invalid email or password");
      } else if (error.name === "FirebaseError") {
        setGlobalErrorToast(error.message.replace("Firebase: ", ""));
      } else {
        throw error;
      }
    }
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
          <label htmlFor="username">Email</label>
          <input
            ref={inputRef}
            type="email"
            className="form-control"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
