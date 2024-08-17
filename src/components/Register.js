// src/components/Register.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { store } from "../store";
import { setUser } from "../slices/user";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { setGlobalErrorToast } from "../errorHandler";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    try {
      if (password !== confirmPassword) {
        setGlobalErrorToast("Password do not match");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("regiest success", userCredential.user);
      store.dispatch(setUser(userCredential.user.toJSON()));
      navigate("/");
    } catch (error) {
      if (error.name === "FirebaseError") {
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            ref={inputRef}
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
