import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
class TableRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr>
        <td>{this.props.obj.title}</td>
        <td>{this.props.obj.ISBN}</td>
        <td>{this.props.obj.author}</td>
        <td>{this.props.obj.description}</td>
        <td>{this.props.obj.category}</td>
        <td>{this.props.obj.stock}</td>
        <td>
          <Link
            to={"/update/books/" + this.props.obj._id}
            className="btn btn-primary"
          >
            Edit
          </Link>
        </td>
        <td>
          <button
            onClick={() =>
              axios
                .delete(
                  "http://localhost:8000/api/delete/books/" + this.props.obj._id
                )
                .then(() => this.props.deleteItem(this.props.obj._id))
                .catch((err) => console.log(err, "eror occurred"))
            }
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

export default TableRow;
