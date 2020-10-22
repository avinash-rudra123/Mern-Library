import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
class AdminDashBoard extends Component {
  constructor(props) {
    super(props);
  }
  logout = () => {
    localStorage.clear("token");
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
          <Link className="navbar-brand" to="/admin/dashboard/getbook">
            Library ManageMent
          </Link>
          <Link className="navbar-brand m-4" to="/admin/dashboard/create">
            Create
          </Link>
          <Link className="navbar-brand m-4" to="/activity">
            ActivityLog
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
              <li className="nav-item m-4">
                <Button className="btn btn-info" onClick={this.logout}>
                  Logout
                </Button>
              </li>
              <Link to="/message">
                <i
                  className="fa fa-bell m-4 w-30 p-3 h-30"
                  aria-hidden="true"
                ></i>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
export default withRouter(AdminDashBoard);
