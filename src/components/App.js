import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./Note";
import Sidebar from "./Sidebar";
import Register from "./Register";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { useSelector } from "react-redux";
import HomePage from "./HomePage";
import PublicLayout from "./PublicLayout";
import SystemInfo from "./SystemInfo";

const RootLandingPage = () => {
  const user = useSelector((state) => state.user);
  const client = useSelector((state) => state.client);
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
            path="/note/:id"
            element={
              <PrivateRoute>
                <div className="container-fluid position-fixed h-100">
                  <div className="row h-100">
                    <div
                      className="col-md-3 bg-light h-100"
                      style={{ overflow: "auto" }}
                    >
                      <Sidebar />
                    </div>
                    <div
                      className="col-md-9 h-100"
                      style={{ overflow: "auto" }}
                    >
                      <Note />
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <SystemInfo />
    </>
  );
};

export default App;
