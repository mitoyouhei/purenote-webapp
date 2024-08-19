import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalErrorToast } from "../errorHandler";
import { auth } from "../firebase";
import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
} from "firebase/auth";
import Spinner from "./Spinner";
import { logout, store } from "../store";
import { setUser } from "../slices/user";

function getOobCodeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("oobCode");
}

const ResetPassword = () => {
  const [email, setEmail] = useState<string | null>("");
  const [oobCode, setOobCode] = useState<string | null>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && email) {
      inputRef.current.focus();
    }
  }, [email]);

  useEffect(() => {
    async function verify() {
      try {
        const code = getOobCodeFromURL();
        setOobCode(code);

        if (code) {
          const email = await verifyPasswordResetCode(auth, code);
          setEmail(email);
        } else {
          setError("Invalid or missing code.");
        }
      } catch (error: any) {
        setError(error.message);
      }
    }
    verify();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setGlobalErrorToast("Password do not match");
        return;
      }

      await confirmPasswordReset(auth, oobCode ?? "", password);
      alert("Password has been reset successfully.");

      await logout();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email ?? "",
        password
      );
      console.log("login success", userCredential.user);
      store.dispatch(setUser(userCredential.user.toJSON()));
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (error.name === "FirebaseError") {
        setError(error.message.replace("Firebase: ", ""));
      } else {
        throw error;
      }
    }
  };

  if (error)
    return (
      <div
        className="container my-5"
        style={{
          maxWidth: "500px",
        }}
      >
        <h1>Reset Password</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  if (!email) return <Spinner />;
  return (
    <div
      className="container my-5"
      style={{
        maxWidth: "500px",
      }}
    >
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            ref={inputRef}
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
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
