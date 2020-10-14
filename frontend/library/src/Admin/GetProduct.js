import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TableRow from "./TableRow";
import { API } from "../url";
class GetProduct extends Component {
  constructor(props) {
    super(props);
    this.state = { book: [] };
    this.bookRow = this.bookRow.bind(this);
  }
  componentDidMount() {
    axios
      .get(`${API}/list/book`)
      .then((response) => {
        this.setState({ book: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  deleteItemHandler = (id) => {
    const updated = this.state.book.filter((book) => book._id !== id);
    console.log(updated);
    this.setState({ book: updated });
  };
  bookRow() {
    return this.state.book.map((Object, i) => {
      return (
        <TableRow obj={Object} deleteItem={this.deleteItemHandler} key={i} />
      );
    });
  }

  render() {
    return (
      <div>
        <div>
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <Link className="navbar-brand" to="admin/dashboard/getbook">
              Library ManageMent
            </Link>
            <Link className="navbar-brand m-4" to="/admin/dashboard/create">
              Create
            </Link>
            <Link className="navbar-brand m-4" to="/activity">
              ActivityLog
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
              <form class="form-inline my-2 my-lg-0">
                <input
                  class="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  class="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
                <Link className="navbar-brand m-4" to="/admin/login">
                  <button
                    onClick={() =>
                      axios
                        .get("http://localhost:8000/api/logout")
                        .then((response) =>
                          localStorage.removeItem("jwt", response.data)
                        )
                        .catch((err) => {
                          console.log(err);
                        })
                    }
                  >
                    Logout
                  </button>
                </Link>
              </form>
            </div>
          </nav>
        </div>
        <h3 align="center">Book INFORMATION</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>ISBN</th>
              <th>Author</th>
              <th>Description</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Issue</th>
              <th>Return</th>
            </tr>
          </thead>
          <tbody>{this.bookRow()}</tbody>
        </table>
      </div>
    );
  }
}
export default GetProduct;
