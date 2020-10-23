import React, { Component, Fragment } from "react";
import axios from "axios";
import DashBoard from "../DashBoard/DashBoard";
class NewPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirm_password: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      password: this.state.password,
    };
    console.log(newUser);
    if (this.state.password !== this.state.confirm_password) {
      return false;
    } else {
      const user = {
        password: this.state.password,
        confirm_password: this.state.confirm_password,
      };
      axios.post("/api/new-password", user).then((res) => {
        this.props.history.push("/login");
      });
    }
  };
  render() {
    return (
      <Fragment>
        <DashBoard />
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  <input
                    type="password"
                    className="form-control"
                    name="confirm_password"
                    placeholder="Enter a confirm_password"
                    value={this.state.confirm_password}
                    onChange={this.onChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Upadate password:
                </button>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default NewPassword;
