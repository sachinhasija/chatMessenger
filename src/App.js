import React, { Component } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Users from "./pages/Users/Users";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { toast, ToastContainer } from "react-toastify";

class App extends Component {
  showNotification = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Router>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position={toast.POSITION.TOP_CENTER}
        />
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route
            path="/login"
            render={(props) => (
              <Login showNotification={this.showNotification} {...props} />
            )}
          />
          <Route
            path="/profile"
            render={(props) => (
              <Profile showNotification={this.showNotification} {...props} />
            )}
          />
          <Route
            path="/signup"
            render={(props) => (
              <Signup showNotification={this.showNotification} {...props} />
            )}
          />
          <Route
            path="/users"
            render={(props) => (
              <Users showNotification={this.showNotification} {...props} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
