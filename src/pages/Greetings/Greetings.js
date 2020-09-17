import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./Greetings.css";

export default class Greetings extends Component {
  render() {
    return (
      <div className="viewWelcomeBoard">
        <img
          className="avatarWelcome"
          src={this.props.currentUserPhoto}
          alt=""
        />
        <span className="textTitleWelcome">
          {`Welcome, ${this.props.currentUserName}`}
        </span>
        <span className="textDescriptionWelcome">Let's begin.</span>
      </div>
    );
  }
}
