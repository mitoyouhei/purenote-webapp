// src/components/Register.js
import React, { useEffect, useRef, useState } from "react";

import Spinner from "./Spinner";

export const RegisterForm = ({
  loading,
  error,
  createUser,
}: {
  loading: boolean;
  error: string | null;
  createUser: (email: string, password: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordNotMatch(false);
    if (password !== confirmPassword) {
      setPasswordNotMatch(true);
      return;
    }

    createUser(email, password);
  };

  const errorMessage =
    error && !passwordNotMatch ? (
      <div className="alert alert-danger mt-2" role="alert">
        {error}
      </div>
    ) : null;
  const passwordNotMatchMessage = passwordNotMatch ? (
    <div className="alert alert-danger mt-2" role="alert">
      Password do not match
    </div>
  ) : null;
  return (
    <div
      className="container my-5"
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Register</h1>
      {loading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              ref={inputRef}
              type="email"
              className="form-control"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Register
          </button>
          {errorMessage}
          {passwordNotMatchMessage}
        </form>
      )}
    </div>
  );
};
