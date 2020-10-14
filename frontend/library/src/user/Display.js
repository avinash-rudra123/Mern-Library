import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TableRow from "./TableRow";
import { API } from "../url";
class Display extends Component {
  constructor(props) {
    super(props);
    this.state = { book: [] };
    this.tabRow = this.tabRow.bind(this);
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
  componentDidUpdate(){
    
  }
  tabRow() {
    return this.state.book.map((Object, i) => {
      return <TableRow obj={Object} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <div>
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <Link className="navbar-brand" to="/">
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
              <ul className="navbar-nav mr-auto ">
                <li className="nav-item">
                  <Link className="nav-link f-1" to="/login">
                    Logout
                  </Link>
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0">
                <input
                  class="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  id="searchName"
                />
                <button
                  class="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    axios
                      .get("http://localhost:8000/api/books?limit=undefined")
                      .then((response) => {
                        console.log(response.data);
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  Search
                </button>
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
          <tbody>{this.tabRow()}</tbody>
        </table>
      </div>
    );
  }
}
export default Display;
