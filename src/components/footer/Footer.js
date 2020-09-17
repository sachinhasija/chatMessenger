import React, { Component } from "react";
import "./Footer.css";

class Footer extends Component {
  Copyright = () => {
    return (
      <h2 vairant="body2" color="textSecondary" align="center">
        {"Copyright \u00A9 "}
        {"Sachin Hasija "}
        {new Date().getFullYear()}
        {"."}
      </h2>
    );
  };

  render() {
    return <div className="footer 1-box is-center">{this.Copyright()}</div>;
  }
}

export default Footer;
