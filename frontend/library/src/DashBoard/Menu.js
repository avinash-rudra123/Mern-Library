import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAthunticated } from "../auth/index";
const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#E74292" };
  } else {
    return { color: "#000000" };
  }
};

const Menu = ({ history }) => {
  const [state, setState] = useState("");
  const [error, setError] = useState("");

  return (
    <nav
      className="navbar navbar-fixed navbar-expand-lg navbar-light border-bottom"
      style={{ backgroundColor: "white" }}
    >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse ml-5" id="navbarNavDropdown">
        {/* <form className="form-inline mr-5">
          <input
            className="form-control mr-sm-2"
            aria-label="Search"
            type="search"
            onChange={(e) => setState(e.target.value)}
            placeholder="search"
          />
          <Link
            className="btn btn-outline-dark  my-2 my-sm-0"
            to={`/products/search/?q=${state}`}
          >
            Search
          </Link>
        </form> */}

        <ul className="navbar-nav">
          {isAthunticated() && isAthunticated().user.role === "user" && (
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="bottom"
              title="DASHBOARD"
            >
              <Link
                style={currentTab(history, "/user/dashboard")}
                className="nav-link"
                to="/user/dashboard"
              >
                <i class="fa fa-user-o" aria-hidden="true"></i>
              </Link>
            </li>
          )}
          {isAthunticated() && isAthunticated().user.role === "superadmin" && (
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="bottom"
              title="DASHBOARD"
            >
              <Link
                style={currentTab(history, "/admin/dashboard")}
                className="nav-link"
                to="/admin/dashboard"
              >
                <i class="fa fa-user-o" aria-hidden="true"></i>
              </Link>
            </li>
          )}
          {!isAthunticated() && (
            <Fragment>
              <li className="nav-item">
                <Link
                  style={currentTab(history, "/signup")}
                  className="nav-link"
                  to="/signup"
                >
                  Signup
                </Link>
              </li>
              <li className="nav-item ">
                <Link
                  style={currentTab(history, "/signin")}
                  className="nav-link"
                  to="/login"
                >
                  Sign In
                </Link>
              </li>
            </Fragment>
          )}
          {isAthunticated() && (
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="bottom"
              title="SIGN OUT"
            >
              <span
                className="nav-link text-dark"
                onClick={() => {
                  signout(() => {
                    history.push("/");
                  });
                }}
              >
                <i class="fa fa-sign-out" aria-hidden="true"></i>
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Menu);
