import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import { Card } from "react-bootstrap";
import firebase from "../../services/firebase";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LoginString from "../Login/Loginstring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      password: "",
      error: null,
    };
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = async (event) => {
    const { name, password, email } = this.state;
    event.preventDefault();
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          firebase
            .firestore()
            .collection("users")
            .add({
              name,
              id: result.user.uid,
              description: "",
              email,
              password,
              URL: "",
              messages: [{ notificationId: "", number: 0 }],
            })
            .then((docRef) => {
              localStorage.setItem(LoginString.ID, result.user.uid);
              localStorage.setItem(LoginString.Name, name);
              localStorage.setItem(LoginString.Email, email);
              localStorage.setItem(LoginString.Password, password);
              localStorage.setItem(LoginString.PhotoURL, "");
              localStorage.setItem(LoginString.UPLOAD_CHANGED, "state_changed");
              localStorage.setItem(LoginString.Description, "");
              localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
              this.setState({
                name: "",
                password: "",
                email: "",
                url: "",
              });
              this.props.history.push("/users");
            })
            .catch((error) => {
              document.getElementById("1").innerText = error.message
                ? error.message
                : "Error in signing up, please try again.";
            });
        })
        .catch((error) => {
          document.getElementById("1").innerText = error.message
            ? error.message
            : "Error in signing up, please try again.";
        });
    } catch (err) {
      document.getElementById("1").innerHTML =
        "Error in signing up, please try again.";
    }
  };
  render() {
    const Signinsee = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#fff",
      backgroundColor: "#1ebea5",
      width: "100%",
      boxShadow: "0 5px 5px #808888",
      height: "10rem",
      paddtingTop: "48px",
      opacity: "0.5",
      borderBottom: "5px solid green",
    };
    return (
      <div>
        <CssBaseline />
        <Card style={Signinsee}>
          <div>
            <Typography component="h1" vairant="h5">
              Sign Up To
            </Typography>
          </div>
          <div>
            <Link to="/">
              <button className="btn">
                <FontAwesomeIcon icon={faHome}>Lets Chat</FontAwesomeIcon>
              </button>
            </Link>
          </div>
        </Card>
        <Card className="formcontrooutside">
          <form className="customform" noValidate onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address-example:abc@gmail.com"
              autoComplete="email"
              autoFocus
              onChange={this.handleChange}
              value={this.state.email}
            />
            <div>
              <p style={{ color: "grey", fontSize: "15px", marginLeft: "0" }}>
                Password: length Greater than 6(alphabet, number, special
                character)
              </p>
            </div>
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              autoComplete="name"
              autoFocus
              onChange={this.handleChange}
              value={this.state.name}
            />
            <div>
              <p style={{ color: "grey", fontSize: "15px" }}>
                Please fill all fields.
              </p>
            </div>
            <div className="CenterAlignItems">
              <button className="button1" type="submit">
                <span>Sign Up</span>
              </button>
            </div>
            <div>
              <p style={{ color: "grey" }}>Already have an account?</p>
              <Link to="/login">Login</Link>
            </div>
            <div className="error">
              <p id="1" style={{ color: "red" }}></p>
            </div>
          </form>
        </Card>
      </div>
    );
  }
}
