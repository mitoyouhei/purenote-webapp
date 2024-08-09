import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./Note";
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

const RootLandingPage = () => {
  const user = useSelector((state) => state.user);
  const client = useSelector((state) => state.client);
  // TODO - remove Note as the redirect component
  return user.token && client.socketConnected ? (
    <Note />
  ) : (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
};

const App = () => {
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
          <Route
            path="/homepage"
            element={
              <PublicLayout>
                <HomePage />
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
