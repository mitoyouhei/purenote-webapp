import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { store } from "../store";
import { setUser } from "../slices/user";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { setGlobalErrorToast } from "../errorHandler";
import Spinner from "./Spinner";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("login success", userCredential.user);
      store.dispatch(setUser(userCredential.user.toJSON()));
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setGlobalErrorToast("Invalid email or password");
      } else if (error.name === "FirebaseError") {
        setGlobalErrorToast(error.message.replace("Firebase: ", ""));
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
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
        </form>
      )}
    </div>
  );
};
