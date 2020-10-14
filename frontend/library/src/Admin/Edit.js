import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
class Edit extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      title: "",
      ISBN: "",
      author: "",
      description: "",
      category: "",
      stock: "",
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit(e) {
    e.preventDefault();
    const user = {
      title: this.state.title,
      ISBN: this.state.ISBN,
      author: this.state.author,
      description: this.state.description,
      categor: this.state.category,
      stock: this.state.stock,
    };
    axios
      .put(
        "http://localhost:8000/api/update/books/" + this.props.match.params.id,
        user
      )
      .then((res) => console.log(res.data, user))
      .catch((err) => console.log(err));
    this.props.history.push("/admin/dashboard/getbook");
  }

  render() {
    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <div className="col-md-6 mt-5 mx-auto">
            <form onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Update Book</h1>
              <div className="form-group">
                <label htmlFor="userName">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Title name"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ISBN">ISBN</label>
                <input
                  type="text"
                  name="ISBN"
                  placeholder="Enter ISBN"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  placeholder="Enter author name"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Category</label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  placeholder="category"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  placeholder="Enter Stock"
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Edit Book
              </button>
              <Link to="/admin/dashboard/getbook">
                <button type="button" className="btn btn-light m-3">
                  Cancel
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Edit;
