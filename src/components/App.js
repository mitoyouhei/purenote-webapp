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
import { MdOutlineClose, MdRefresh } from "react-icons/md";
import { store } from "../store";
import { setErrorMessage } from "../slices/client";

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
  const client = useSelector((state) => state.client);
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
                <div className="container-fluid position-fixed h-100">
                  <div className="row h-100">
                    <div
                      className="col-md-3 bg-light h-100"
                      style={{ overflow: "auto" }}
                    >
                      <Sidebar />
                    </div>
                    <div className="col-md-9 h-100 p-0">
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
      {client.errorMessage && (
        <div
          className="toast align-items-center text-bg-danger border-0 show position-fixed bottom-0 end-0 m-2"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="toast-body">{client.errorMessage}</div>

            <div>
              <button
                type="button"
                style={{ color: "#fff" }}
                className="btn"
                onClick={() => window.location.reload()}
              >
                <MdRefresh />
              </button>
              <button
                type="button"
                style={{ color: "#fff" }}
                className="btn"
                onClick={() => store.dispatch(setErrorMessage(null))}
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
