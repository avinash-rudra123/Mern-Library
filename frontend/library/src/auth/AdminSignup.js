import React, { Component, Fragment } from "react";
import { Adminregister } from "../auth/index";
import DashBoard from "../DashBoard/DashBoard";
import { Link, withRouter } from "react-router-dom";
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};
class AdminSignUp extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      email: null,
      password: null,
      confirm_password: null,
      formErrors: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      },
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = (e) => {
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "name":
        formErrors.name =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      case "confirm_password":
        formErrors.confirm_password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };
  onSubmit = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        userName: ${this.state.userName}
        Email: ${this.state.email}
        Password: ${this.state.password}
        Confirm_Password: ${this.state.confirm_password}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
    };
    console.log(newUser);

    Adminregister(newUser).then((res) => {
      if (res) {
        this.props.history.push("/admin/login");
      } else {
        alert("Registration failed plz chk the email and passwords");
      }
    });
    this.setState({
      email: "",
      password: "",
    });
  };
  render() {
    const { formErrors } = this.state;
    return (
      <Fragment>
        <DashBoard></DashBoard>
        <div className="wrapper">
          <div className="form-wrapper">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Admin-Register</h1>
                <div className="name">
                  <label htmlFor="userName">Name</label>
                  <input
                    className={formErrors.name.length > 0 ? "error" : null}
                    placeholder=" Name"
                    type="text"
                    name="name"
                    noValidate
                    onChange={this.onChange}
                  />
                  {formErrors.name.length > 0 && (
                    <span className="errorMessage">{formErrors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    onChange={this.onChange}
                  />
                  {formErrors.email.length > 0 && (
                    <span className="errorMessage">{formErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    onChange={this.onChange}
                  />
                  {formErrors.password.length > 0 && (
                    <span className="errorMessage">{formErrors.password}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Confirm_password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirm_password"
                    placeholder="Confirm_password"
                    onChange={this.onChange}
                  />
                  {formErrors.confirm_password.length > 0 && (
                    <span className="errorMessage">
                      {formErrors.confirm_password}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Admin SignUp
                </button>
                <Link to="/admin/login">Admin login</Link>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default withRouter(AdminSignUp);
