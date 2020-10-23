import React, { Fragment } from "react";
import { useFormik } from "formik";
import { register } from "../auth/index";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import DashBoard from "../DashBoard/DashBoard";
const SignUp = ({ history }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, " Name is Too Short.")
      .required(" Name is Required."),
    email: Yup.string().email().required("Email is Required."),
    password: Yup.string()
      .required("Password is Required.")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/(?=.*[0-9])/, "Password must contain a number."),
    confirm_password: Yup.string()
      .required("confirm_Password is required.")
      .min(6, "confirm_Password is too short - should be 6 chars minimum.")
      .matches(/(?=.*[0-9])/, "confirm_Password must contain a number."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },

    validationSchema: validationSchema,

    onSubmit: (values) => {
      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
      };

      register(newUser)
        .then((res) => {
          toast.success("Registration successfully", history.push("/login"));
        })
        .catch((err) => toast.error("Registration failed"));
    },
  });
  return (
    <Fragment>
      <DashBoard />
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={formik.handleSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="input-feedback">
                    <span style={{ color: "red" }}>{formik.errors.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  id="password"
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
              <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="confirm_password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.confirm_password &&
                  formik.touched.confirm_password && (
                    <div className="input-feedback">
                      <span style={{ color: "red" }}>
                        {formik.errors.confirm_password}
                      </span>
                    </div>
                  )}
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
                <ToastContainer />
              </button>
            </form>
            ;<Link to="/login">Login ? Already have Account</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SignUp;
