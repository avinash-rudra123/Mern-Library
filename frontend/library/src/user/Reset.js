import React, { Component } from "react";
import axios from "axios";
class Reset extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
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
      email: this.state.email,
    };
    console.log(newUser);
    const user = {
      email: this.state.email,
    };
    if (this.state.email === "") return false;
    axios
      .post("/api/reset", user)
      .then((res) => console.log(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          console.log(err.response.data.msg);
        } else {
          console.log("something went wrong");
        }
      });

    this.props.history.push("/newpassword");
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Reset:
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Reset;
