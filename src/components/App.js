import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { useSelector } from "react-redux";
import HomePage from "./HomePage";
import PublicLayout from "./PublicLayout";
import SystemInfo from "./SystemInfo";
import NoteApp from "./NoteApp";
import ErrorToast from "./ErrorToast";
import Folders from "./Folders";
import ResetPassword from "./ResetPassword";
import Logout from "./Logout";

const RootLandingPage = () => {
  const user = useSelector((state) => state.user);

  // TODO - remove Note as the redirect component
  return user ? (
    <PrivateRoute>
      <NoteApp />
    </PrivateRoute>
  ) : (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
};

const App = () => {
  const handleSaveShortcut = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      console.log("Save shortcut triggered");
    }
  };

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
            path="/homepage"
            element={
              <PublicLayout>
                <HomePage />
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
                <NoteApp />
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
        </Routes>
      </Router>
      <SystemInfo />
      <ErrorToast />
    </>
  );
};

export default App;
