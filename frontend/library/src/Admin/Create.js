import React, { Component } from "react";
import { createProduct } from "../auth/index";
class Create extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      ISBN: "",
      author: "",
      description: "",
      category: "",
      stock: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      title: this.state.title,
      ISBN: this.state.ISBN,
      author: this.state.author,
      description: this.state.description,
      categor: this.state.category,
      stock: this.state.stock,
    };
    console.log(newUser);

    createProduct(newUser).then((res) => {
      this.props.history.push(`/admin/dashboard/getbook`);
    });
  };
  render() {
    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <div className="col-md-6 mt-5 mx-auto">
            <form onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">CREATE Book</h1>
              <div className="form-group">
                <label htmlFor="title">Title</label>
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
                  name="stcok"
                  placeholder="Enter Stock"
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                CREATE Book
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Create;
