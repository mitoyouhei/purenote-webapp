import React from "react";
import { Link } from "react-router-dom";

const PublicLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <div className="content">
        <nav className="navbar" style={{ backgroundColor: "#f5e6c7" }}>
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
      </div>
      <footer className="footer text-center text-lg-start border-top">
        <div className="container p-5">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <h5 className="text-uppercase">Just Note</h5>
              <p>Writing, Thinking, Creating - No Need for Complexity!</p>
            </div>

            <div className="col-lg-6 col-md-6">
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled mb-0">
                <li>
                  <Link to="/login" className="text-dark">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-dark">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* <div className="col-lg-4 col-md-12">
              <h5 className="text-uppercase">Follow Us</h5>
              <a href="/" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="/" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="/" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="/" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div> */}
          </div>
        </div>
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2024 Just Note. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
