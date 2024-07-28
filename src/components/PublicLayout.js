import React from "react";
import { Link } from "react-router-dom";

const PublicLayout = ({ children }) => {
  return (
    <>
      <nav className="navbar  bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="/logo-name.png"
              alt="Just Note"
              style={{ width: 180 }}
            ></img>
          </Link>
          <div>
            <Link to="/login" className="btn btn-primary me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary me-2">
              Register
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default PublicLayout;
