import "./App.css";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoute from "../components/PrivateRoute";
import PublicLayout from "../components/PublicLayout";
import SystemInfo from "../components/SystemInfo";
import ErrorToast from "../components/ErrorToast";

import { Register } from "./Register";
import { Login } from "./Login";
import { Home } from "./Home";
import { ResetPassword } from "./ResetPassword";
import { Logout } from "./Logout";
import { Note } from "./Note";
import { Folders } from "./Folders";
import { NotFound } from "./NotFound";
import { Notebooks } from "./Notebooks";

const RootLandingPage = () => {
  const user = useSelector((state) => state.user);

  // TODO - remove Note as the redirect component
  return user ? (
    <PrivateRoute>
      <Note />
    </PrivateRoute>
  ) : (
    <PublicLayout>
      <Home />
    </PublicLayout>
  );
};
const handleSaveShortcut = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    console.log("Save shortcut triggered");
  }
};

const App = () => {
  useEffect(() => {
    document.addEventListener("keydown", handleSaveShortcut);
    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route path="/" element={<RootLandingPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/home"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <PublicLayout>
                <ResetPassword />
              </PublicLayout>
            }
          />
          <Route
            path="/note/:id"
            element={
              <PrivateRoute>
                <Note />
              </PrivateRoute>
            }
          />
          <Route
            path="/folders"
            element={
              <PrivateRoute>
                <Folders />
              </PrivateRoute>
            }
          />
          <Route
            path="/notebooks"
            element={
              <PrivateRoute>
                <Notebooks />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            }
          />
        </Routes>
      </Router>
      <SystemInfo />
      <ErrorToast />
    </>
  );
};

export default App;
