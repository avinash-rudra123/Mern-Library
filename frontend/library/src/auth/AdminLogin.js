import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Adminlogin, authenticate, isAthunticated } from "../auth/index";
import Img from "../Img/img.jpg";
const AdminLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirect: false,
  });
  const { email, password, error, loading, redirect } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    Adminlogin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              redirect: true,
            });
          });
        }
      })
      .catch(console.log("signin requets failed"));
  };

  const direct = () => {
    if (redirect) {
      return <Redirect to="/admin/dashboard/getbook" />;
    }
  };
  const loginForm = () => {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <h5 className="font-weight-primary">Admin Login</h5>
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

          <button
            className="btn btn-sm btn-dark mt-3"
            id="button"
            type="submit"
          >
            Admin Login
          </button>
        </form>
      </div>
    );
  };
  const loadingMessage = () => {
    return (
      loading && (
        <div className="d-flex justify-content-center mt-2">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )
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
              {loadingMessage()}
              {loginForm()}
              {errorMessage()}
              {direct()}
              <div className="mt-2 text-dark">
                <div className="mt-2 text-dark">
                  <Link to="/forget" className="text-primary">
                    Forget Password ?
                  </Link>
                </div>
                <div className="mt-1">
                  New Admin?
                  <Link to="/admin/login" className="text-primary ml-2">
                    Admin Register
                  </Link>
                </div>
              </div>
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
export default AdminLogin;
