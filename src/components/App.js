import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Note from "./Note";
import Sidebar from "./Sidebar";
import Register from "./Register";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <div className="container-fluid position-fixed h-100">
        <div className="row h-100">
          <div className="col-md-3 bg-light">
            <nav className="navbar navbar-light bg-light">
              {user.token ? (
                <span className="navbar-text">
                  Logged in as: {user.username}
                </span>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              )}
            </nav>
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Note />
                  </PrivateRoute>
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
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
