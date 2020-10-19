import React, { Component, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
class Mybook extends Component {
  constructor(props) {
    super(props);
    this.state = { mybook: [] };
  }
  componentDidMount() {
    const user_id = localStorage.getItem("id");
    axios
      .get(`/api/books/issue/${user_id}`)
      .then((response) => {
        this.setState({ mybook: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
          <Link className="navbar-brand" to="/user/dashboard">
            Library ManageMent
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse dashboard"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav  ">
              <li className="nav-item">
                <Link className="nav-link f-1" to="/mybooks">
                  Mybook
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav mr-auto ">
              <li className="nav-item">
                <Link className="nav-link f-1" to="/login">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <h2 align="center">User Issue Book</h2>
        <table
          className="table table-striped"
          style={{ marginTop: 20, backgroundColor: "grey" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>issueDate</th>
              <th>ReturnDate</th>
            </tr>
          </thead>
          <tbody>
            {this.state.mybook.map((c, i) => {
              return (
                <tr key={i}>
                  <td>{c.book_info.title}</td>
                  <td>{c.book_info.author}</td>
                  <td>{c.book_info.issueDate}</td>
                  <td>{c.book_info.returnDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default Mybook;
