import React, { Fragment } from "react";
import { Adminlogin } from "../auth/index";
import DashBoard from "../DashBoard/DashBoard";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminLogin = ({ history }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is Required."),
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

      Adminlogin(user)
        .then((res) => {
          if (res.role === "superadmin") {
            history.push(`/admin/dashboard/getbook`);
          }
        })
        .catch((err) => toast.error("Access denied"));
    },
  });
  return (
    <Fragment>
      <DashBoard />
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={formik.handleSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Admin Login</h1>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="input-feedback">
                    {" "}
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
                <ToastContainer />
              </button>
            </form>
            ;<Link to="/admin/signup">Register ? if dont have Account</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminLogin;
