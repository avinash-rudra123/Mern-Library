import React, { Component, Fragment } from "react";
import { login } from "../auth/index";
import DashBoard from "../DashBoard/DashBoard";
import { Link } from "react-router-dom";
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

class LoginValidation extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      formErrors: {
        email: "",
        password: "",
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  }
  onSubmit(e) {
    e.preventDefault();
    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        Email: ${this.state.email}
        Password: ${this.state.password}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    login(user).then((res) => {
      if (res) {
        this.props.history.push(`/user/dashboard`);
      } else {
        alert("sigin request failed ");
      }
    });
  }
  render() {
    const { formErrors } = this.state;
    return (
      <Fragment>
        <DashBoard></DashBoard>
        <div className="wrapper">
          <div className="form-wrapper">
            <div className="col-md-6 mt-5 mx-auto">
              <form noValidate onSubmit={this.onSubmit}>
                <div className="email">
                  <label htmlFor="email">Email</label>
                  <input
                    className={formErrors.email.length > 0 ? "error" : null}
                    placeholder="Email"
                    type="email"
                    name="email"
                    noValidate
                    required
                    onChange={this.onChange}
                  />
                  {formErrors.email.length > 0 && (
                    <span className="errorMessage">{formErrors.email}</span>
                  )}
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    className={formErrors.password.length > 0 ? "error" : null}
                    placeholder="Password"
                    type="password"
                    name="password"
                    required
                    noValidate
                    onChange={this.onChange}
                  />
                  {formErrors.password.length > 0 && (
                    <span className="errorMessage">{formErrors.password}</span>
                  )}
                </div>
                <button type="submit" className="btn btn-sm btn-primary ">
                  Sign in
                </button>
                <Link to="/signup">
                  <button type="submit" className="btn m-2 btn-sm btn-primary ">
                    Register
                  </button>
                </Link>
                <Link to="/reset">
                  <button
                    type="submit"
                    className="btn m-2 btn-sm btn-primary  "
                  >
                    Forget Password
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default LoginValidation;
