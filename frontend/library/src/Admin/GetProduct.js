import React, { Component, Fragment } from "react";
import axios from "axios";
import AdminDashBoard from "./AdminDashBoard";
import { Link } from "react-router-dom";
// import TableRow from "./TableRow";
import { Table, Form, Container, Button } from "react-bootstrap";
class GetProduct extends Component {
  constructor(props) {
    super(props);
    this.state = { book: [] };
    this.deleteItemHandler = this.deleteItemHandler.bind(this);
  }
  componentDidMount() {
    axios
      .get("/api/list/book")
      .then((response) => {
        this.setState({ book: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // bookRow() {
  //   return this.state.book.map((Object, i) => {
  //     return (
  //       <TableRow obj={Object} deleteItem={this.deleteItemHandler} key={i} />
  //     );
  //   });
  // }
  search(key) {
    console.warn(key);
    this.setState({ lastSearch: key });
    fetch("/api/admin/books/search/?title=" + key).then((data) => {
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
  deleteItemHandler = (id) => {
    const updated = this.state.book.filter((book) => book._id !== id);
    console.log(updated);
    this.setState({ book: updated });
  };
  render() {
    return (
      <Fragment>
        <AdminDashBoard />
        <Container>
          <h1>Book Search</h1>

          <Form.Control
            type="text"
            onChange={(event) => this.search(event.target.value)}
            placeholder="Search Book....."
          />
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
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.searchData.map((item, i) => (
                      <tr key={i}>
                        <td>{item.title}</td>
                        <td>{item.ISBN}</td>
                        <td>{item.author}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>
                          <Link
                            to={"/api/update/books/" + item._id}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              axios
                                .delete("/api/delete/books/" + item._id)
                                .then(() => this.deleteItemHandler(item._id))
                                .catch((err) =>
                                  console.log(err, "eror occurred")
                                )
                            }
                            className="btn btn-danger"
                          >
                            Delete
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
                      <th>Edit</th>
                      <th>Delete</th>
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
                          <Link
                            to={"/api/update/books/" + item._id}
                            className="btn btn-primary"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <Button
                            onClick={() =>
                              axios
                                .delete("/api/delete/books/" + item._id)
                                .then(() => this.deleteItemHandler(item._id))
                                .catch((err) =>
                                  console.log(err, "eror occurred")
                                )
                            }
                            className="btn btn-danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {this.state.noData ? <h3>No Data Found</h3> : null}
          </div>
        </Container>
      </Fragment>
    );
  }
}
export default GetProduct;
