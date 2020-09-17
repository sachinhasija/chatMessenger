import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./Home.css";
import images from "../../Assests/projectImages";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="splash-container">
          <div className="splash">
            <h1 className="splash-head">LETS CHAT</h1>
            <p className="splash-subhead">Lets talk with your friends</p>
            <div id="custom-button-wrapper">
              <Link to="/login" className="my-super-cool-btn">
                <div className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span className="buttoncooltext">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
