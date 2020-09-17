import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../services/firebase";
import LoginString from "../Login/Loginstring";
import "./Login.css";
import { Card } from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      email: "",
      password: "",
      error: null,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  componentDidMount() {
    if (localStorage.getItem(LoginString.ID)) {
      this.setState(
        {
          isLoading: false,
        },
        () => {
          this.setState({ isLoading: false });
          this.props.showNotification(1, "Login Success");
          this.props.history.push("./users");
        }
      );
    } else {
      this.setState({ isLoading: false });
    }
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ error: "" });
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (result) => {
        let user = result.user;
        if (user) {
          await firebase
            .firestore()
            .collection("users")
            .where("id", "==", user.uid)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const currentData = doc.data();
                localStorage.setItem(LoginString.FirebaseDocumentId, doc.id);
                localStorage.setItem(LoginString.ID, currentData.id);
                localStorage.setItem(LoginString.Name, currentData.name);
                localStorage.setItem(LoginString.Email, currentData.email);
                localStorage.setItem(
                  LoginString.Password,
                  currentData.password
                );
                localStorage.setItem(LoginString.PhotoURL, currentData.URL);
                localStorage.setItem(
                  LoginString.Description,
                  currentData.description
                );
              });
            });
        }
        this.props.history.push("/users");
      })
      .catch((err) => {
        document.getElementById("1").innerHTML =
          "Incorrect email/password, please try again";
      });
  };
  render() {
    const paper = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: "10px",
      paddingRight: "10px",
    };
    const rightcomponent = {
      boxShadow: "0 80px 80px #808888",
      backgroundColor: "smokegrey",
    };
    const root = {
      height: "100vh",
      background: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
      marginBottom: "50px",
    };
    const Signinsee = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "White",
      marginBottom: "20px",
      backgroundColor: "#1ebea5",
      width: "100%",
      boxShadow: "0 5px 5px #808888",
      height: "10rem",
      paddingTop: "48px",
      opacity: "0.5",
      borderBottom: "5px solid green",
    };
    const form = {
      width: "100%",
      marginTop: "50px",
    };
    const avatar = {
      backgroundColor: "green",
    };
    return (
      <Grid container component="main" style={root}>
        <CssBaseline />
        <Grid item xs={1} sm={4} md={7} className="image">
          <div className="image1"></div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} style={rightcomponent} elevation={6}>
          <Card style={Signinsee}>
            <div>
              <Avatar style={avatar}>
                <LockOutlinedIcon width="50px" height="50px" />
              </Avatar>
            </div>
            <div>
              <Typography component="h1" variant="h5">
                Sign in To
              </Typography>
            </div>
            <div>
              <Link to="/">
                <button className="btn">
                  <FontAwesomeIcon icon={faHome} />
                  Lets Chat
                </button>
              </Link>
            </div>
          </Card>
          <div style={paper}>
            <form style={form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={this.state.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                type="password"
                label="Password"
                name="password"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={this.state.password}
              />
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
                value="remember"
              />
              <Typography component="h6" variant="h5">
                {this.state.error ? (
                  <p className="text-danger">{this.state.error}</p>
                ) : null}
              </Typography>
              <div className="centerAligningItems">
                <button className="button1" type="submit">
                  <span>Login In</span>
                </button>
              </div>
              <div className="centerAligningItems">
                <p>Don't have an account?</p>
                <Link to="/signup" variant="body2">
                  Sign Up
                </Link>
              </div>
              <div className="error">
                <p id="1" style={{ color: "red" }}></p>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}
