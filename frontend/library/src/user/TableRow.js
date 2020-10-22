import React, { Component, Fragment } from "react";
import axios from "axios";
class TableRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <tr>
          <td>{this.props.obj.title}</td>
          <td>{this.props.obj.ISBN}</td>
          <td>{this.props.obj.author}</td>
          <td>{this.props.obj.description}</td>
          <td>{this.props.obj.category}</td>
          <td>{this.props.obj.stock}</td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => {
                let user_id = localStorage.getItem("id");
                console.log(user_id);
                axios
                  .post(
                    "/api/books/" + this.props.obj._id + "/issue/" + user_id
                  )
                  .then((response) => {
                    console.log(response.data);
                    alert("Issue book successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("not able to issue the book max reached");
                  });
              }}
            >
              ReqBook
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
                  .post(`/api/books/${this.props.obj._id}/return/${user_id}`)
                  .then((response) => {
                    console.log(response.data);
                    alert("Return successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Return unsuccessfull plz frst issue book");
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
              disabled
              onClick={() => {
                let user_id = localStorage.getItem("id");
                console.log(user_id);
                axios
                  .post(`/api/books/${this.props.obj._id}/renew/${user_id}`)
                  .then((response) => {
                    this.setState({ book: response.data });
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
      </Fragment>
    );
  }
}
export default TableRow;
