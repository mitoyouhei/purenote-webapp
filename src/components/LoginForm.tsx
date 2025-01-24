import React, { useEffect, useRef, useState } from "react";
import { AuthContainer } from "./AuthContainer";

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

  return (
    <AuthContainer title="Login" loading={loading} error={error}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            ref={inputRef}
            id="email"
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
            id="password"
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
      </form>
    </AuthContainer>
  );
};
