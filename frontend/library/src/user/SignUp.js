import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../auth/index";
import Img from "../Img/img.jpg";
const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    error: "",
    success: false,
  });
  const { name, email, password, confirmpassword, error, success } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      setValues({
        ...values,
        error: "password and confirm password doesnot match",
      });
      return;
    }
    signup({ name, email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log(error, "error occured in signup"));
  };
  const signUpForm = () => {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <h5 className="font-weight-primary">Register</h5>
          <input
            type="text"
            onChange={handleChange("name")}
            value={name}
            className="form-control bg-light mt-3 text-primary"
            name="name"
            placeholder="Enter your full name"
            id="name"
            required
          />
          <input
            type="email"
            onChange={handleChange("email")}
            value={email}
            className="form-control bg-light mt-3 text-dark"
            name="email"
            placeholder="Enter your email"
            id="email"
            required
          />
          <input
            onChange={handleChange("password")}
            value={password}
            className="form-control bg-light mt-3 text-primary"
            placeholder="Enter a password"
            type="password"
            name="password"
            id="password"
            required
          />
          <input
            type="password"
            onChange={handleChange("confirmpassword")}
            value={confirmpassword}
            className="form-control bg-light mt-3 text-primary"
            placeholder="Confirm Password"
            id="confirm_password"
            name="confirmpassword"
            required
          />

          <button
            className="btn btn-sm btn-dark mt-3"
            id="button"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success mt-2"
        style={{ display: success ? "" : "none" }}
      >
        New account was created successfully. Please
        <Link to="/login">Login Here</Link>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger mt-2"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  return (
    <div className="row" style={{ height: "100%", width: "100%" }}>
      <div className="col-md-4 left bg-light">
        <div className="container">
          <div className="row text-primary mt-5">
            <div className="col-9 offset-2">
              {signUpForm()}
              {errorMessage()}
              {successMessage()}

              <p className="mt-2 text-dark">
                Already a Have Account?
                <a href="/login" className="text-primary ml-2">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-md-8 lg text-info"
        style={{ backgroundImage: `url(${Img})` }}
      ></div>
    </div>
  );
};

export default SignUp;
