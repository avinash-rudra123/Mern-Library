import React, { Component } from "react";

class Row extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr>
        <td>{this.props.act.info}</td>
        <td>{this.props.act.time}</td>
        <td>{this.props.act.time.returnDate}</td>
        <td>{this.props.act.entryTime}</td>
      </tr>
    );
  }
}

export default Row;
