import React, { Fragment } from "react";
import { useFormik } from "formik";
import { login } from "../auth/index";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import DashBoard from "../DashBoard/DashBoard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = ({ history }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .max(50, "Email cannot exceeded with 50")
      .required("Email is Required."),
    password: Yup.string()
      .required(" Password is Required.")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/(?=.*[0-9])/, "Password must contain a number."),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: validationSchema,

    onSubmit: (values) => {
      const user = {
        email: values.email,
        password: values.password,
      };

      login(user)
        .then((res) => {
          if (res) {
            history.push(`/user/dashboard`);
            toast.success("Login successfully");
          }
        })
        .catch((err) => alert("Login failed"));
    },
  });
  return (
    <Fragment>
      <DashBoard />
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={formik.handleSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Login</h1>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="input-feedback">
                    <span style={{ color: "red" }}>{formik.errors.email}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="input-feedback">
                    {" "}
                    <span style={{ color: "red" }}>
                      {formik.errors.password}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Login
              </button>
            </form>
            ;<Link to="/signup">Register ? if dont have Account</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
