import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

export const LoginForm = ({
  loading,
  onSubmit,
  error,
}: {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
  error: string | null;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(email, password);
  }

  const errorMessage = error ? (
    <div className="alert alert-danger mt-2" role="alert">
      {error}
    </div>
  ) : null;
  return (
    <div
      className="container my-5"
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Login</h1>
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
              name="email"
              value={email}
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
          <button type="submit" className="btn btn-primary mt-2">
            Login
          </button>
          {errorMessage}
        </form>
      )}
    </div>
  );
};
