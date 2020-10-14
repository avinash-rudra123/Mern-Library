import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { isAthunticated, logout } from "../auth/index";
function DashBoard() {
  // const { user } = isAthunticated();
  const { user } = logout();
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <Link className="navbar-brand" to="/">
          Library ManageMent
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
            {!isAthunticated() && (
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
            {isAthunticated() && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <button type="submit" onClick={logout(user)}>
                    SignOut
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <img
        src="https://4.imimg.com/data4/DB/QV/MY-29214035/library-management-system-500x500.jpg"
        alt=""
        className="img_side"
      ></img>
    </Fragment>
  );
}

export default DashBoard;
