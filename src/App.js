import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import HomePage from "./components/HomePage";
import PublicLayout from "./components/PublicLayout";
import SystemInfo from "./components/SystemInfo";
import NoteApp from "./components/NoteApp";
import ErrorToast from "./components/ErrorToast";
import Folders from "./components/Folders";
import ResetPassword from "./components/ResetPassword";
import Logout from "./components/Logout";
import NotFound from "./components/NotFound";

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
