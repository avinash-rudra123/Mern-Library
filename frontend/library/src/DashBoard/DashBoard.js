import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import { logout } from "../auth/index";
function DashBoard() {
  const { token } = isAuthenticated();
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <Link className="navbar-brand" to="/">
          Library Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse dashboard"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto ">
            <li className="nav-item active">
              <Link className="nav-link" to="/admin/signup">
                Admin <span className="sr-only">(current)</span>
              </Link>
            </li>
            {!isAuthenticated() && (
              <Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    User Sign-Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    User Login
                  </Link>
                </li>
              </Fragment>
            )}

            <li className="nav-item">
              {isAuthenticated() && (
                <Link className="nav-link" to="/">
                  <button type="submit" onClick={logout()}>
                    SignOut
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
}

export default DashBoard;
