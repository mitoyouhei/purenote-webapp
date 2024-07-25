import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./Note";
import Sidebar from "./Sidebar";
import Register from "./Register";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="container-fluid position-fixed h-100">
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
                <div className="row h-100">
                  <div className="col-md-3 bg-light">
                    <Sidebar />
                  </div>
                  <div className="col-md-9">
                    <Note />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
