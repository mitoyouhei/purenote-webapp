import React, { useEffect, useRef, useState } from "react";
import { AuthContainer } from "./AuthContainer";

export const RegisterForm = ({
  error,
  createUser,
}: {
  error: string | null;
  createUser: (email: string, password: string) => Promise<void>;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    await createUser(email, password);
    setLoading(false);
  };

  const displayError = passwordNotMatch ? "Passwords do not match" : error;

  return (
    <AuthContainer title="Register" loading={loading} error={displayError}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            ref={inputRef}
            id="email"
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
            id="password"
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
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
      </form>
    </AuthContainer>
  );
};
