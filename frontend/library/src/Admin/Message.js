import React, { Component, Fragment } from "react";
import axios from "axios";
import AdminDashBoard from "./AdminDashBoard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = { activity: [] };
  }
  componentDidMount() {
    const user_id = localStorage.getItem("id");
    axios
      .get(`/api/books/issue/${user_id}`)
      .then((response) => {
        this.setState({ activity: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <Fragment>
        <AdminDashBoard />
        <ToastContainer />
        <h2 align="center"> Message LOG</h2>
        <table
          className="table table-striped"
          style={{ marginTop: 20, backgroundColor: "grey" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Book name</th>
              <th>Name</th>
              <th>Issue</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {this.state.activity.map((c, i) => {
              return (
                <tr key={i}>
                  <td>{c.book_info.title}</td>
                  <td>{c.book_info.author}</td>
                  <td>{c.user_id.name}</td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        let user_id = localStorage.getItem("id");
                        console.log(user_id);
                        axios
                          .post(
                            "/api/notify/" +
                              c.book_info.id +
                              "/issue/" +
                              user_id
                          )
                          .then((response) => {
                            console.log(response.data);
                            toast.success("Issue book successfully");
                          })
                          .catch((err) => {
                            console.log(err);
                            toast.error("not able to issue the book ");
                          });
                      }}
                    >
                      Issue
                    </button>
                  </td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        axios
                          .post("/api/cancel")
                          .then((response) => {
                            console.log(response.data);
                            toast.success(
                              "Cancel book successfully mail send to user mail"
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                            toast.error("not able to Cancel the book ");
                          });
                      }}
                    >
                      Camcel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default Message;
