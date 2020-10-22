import React, { Component, Fragment } from "react";
import axios from "axios";
import AdminDashBoard from "./AdminDashBoard";
class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { activity: [] };
  }
  componentWillMount() {
    axios
      .get("/api/activity")
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
        <h2 align="center"> Activity LOG</h2>
        <table
          className="table table-striped"
          style={{ marginTop: 20, backgroundColor: "grey" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>issueDate</th>
              <th>ReturnDate</th>
              <th>Entry-Date</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.activity.map((c, i) => {
              const date = c.time.issueDate.split("T");
              const date2 = c.time.returnDate.split("T");
              const date3 = c.entryTime.split("T");
              const date4 = date3[1].split(".");
              return (
                <tr key={i}>
                  <td>{c.info.title}</td>

                  <td>{date[0]}</td>
                  <td>{date2[0]}</td>
                  <td>{date4[0]}</td>
                  <td>{c.user_id.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}
export default Activity;
