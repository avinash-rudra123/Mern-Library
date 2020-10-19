import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Form, Container, Button } from "react-bootstrap";
class Display extends Component {
  constructor(props) {
    super(props);
    this.state = { book: [], searchData: null, noData: false, lastSearch: "" };
  }
  componentWillMount() {
    axios
      .get("/api/list/book")
      .then((response) => {
        this.setState({ book: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  search(key) {
    console.warn(key);
    this.setState({ lastSearch: key });
    fetch("/api/books/search/?title=" + key).then((data) => {
      data.json().then((resp) => {
        console.warn("resp", resp);
        if (resp.length > 0) {
          this.setState({ searchData: resp, noData: false });
        } else {
          this.setState({ noData: true, searchData: null });
        }
      });
    });
  }
  // tabRow() {
  //   return this.state.book.map((Object, i) => {
  //     return <TableRow obj={Object} key={i} />;
  //   });
  // }
  logout = () => {
    localStorage.clear("token");
    this.props.history.push("/");
  };
  render() {
    return (
      <div>
        <div>
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
                <li className="nav-item m-4">
                  <Button className="btn btn-info" onClick={this.logout}>
                    Logout
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <Container>
          <h1>Book Search</h1>

          <Form.Control
            type="text"
            onChange={(event) => this.search(event.target.value)}
            placeholder="Search Book....."
          />
          <h3 align="center">Book INFORMATION</h3>
          <div>
            {this.state.searchData ? (
              <div>
                <Table striped bordered hover>
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
                  <tbody>
                    {this.state.searchData.map((item) => (
                      <tr>
                        <td>{item.title}</td>
                        <td>{item.ISBN}</td>
                        <td>{item.author}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(
                                  "/api/books/" + item._id + "/issue/" + user_id
                                )
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Issue book successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert(
                                    "not able to issue the book max reached"
                                  );
                                });
                            }}
                          >
                            Issue
                          </button>
                          {/* </form> */}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(
                                  `/api/books/${item._id}/return/${user_id}`
                                )
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Return successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert(
                                    "Return unsuccessfull plz frst issue book"
                                  );
                                });
                            }}
                          >
                            Return
                          </button>
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-info"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(`/api/books/${item._id}/renew/${user_id}`)
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Renew Successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert("U have No book");
                                });
                            }}
                          >
                            Renew
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div>
                <Table striped bordered hover>
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
                      <th>Renew</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.book.map((item, i) => (
                      <tr key={i}>
                        <td>{item.title}</td>
                        <td>{item.ISBN}</td>
                        <td>{item.author}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(
                                  "/api/books/" + item._id + "/issue/" + user_id
                                )
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Issue book successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert(
                                    "not able to issue the book max reached"
                                  );
                                });
                            }}
                          >
                            Issue
                          </button>
                          {/* </form> */}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(
                                  `/api/books/${item._id}/return/${user_id}`
                                )
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Return successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert(
                                    "Return unsuccessfull plz frst issue book"
                                  );
                                });
                            }}
                          >
                            Return
                          </button>
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-info"
                            onClick={() => {
                              let user_id = localStorage.getItem("id");
                              console.log(user_id);
                              axios
                                .post(`/api/books/${item._id}/renew/${user_id}`)
                                .then((response) => {
                                  console.log(response.data);
                                  alert("Renew Successfully");
                                })
                                .catch((err) => {
                                  console.log(err);
                                  alert("U have No book");
                                });
                            }}
                          >
                            Renew
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {this.state.noData ? <h3>NO Book Found.......</h3> : null}
          </div>
        </Container>
      </div>
    );
  }
}
export default Display;
