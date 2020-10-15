import React, { Component, Fragment } from "react";
import axios from "axios";
//import Row from "./Row";
class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { activity: [] };
    // this.activityRow = this.activityRow.bind(this);
  }
  componentWillMount() {
    axios
      .get("api/activity")
      .then((response) => {
        this.setState({ activity: console.log(response.data) });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // activityRow() {
  //   return this.state.activity.map((action, i) => {
  //     return <Row act={action} key={i} />;
  //   });
  // }
  render() {
    return (
      <ul>
        {this.state.activity.map((item, i) => {
          return <li key={i}>{item.info.title}</li>;
        })}
      </ul>
    );
  }
}
export default Activity;
