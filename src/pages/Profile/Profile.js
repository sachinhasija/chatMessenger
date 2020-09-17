import React, { Component } from "react";
import "./Profile.css";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../../services/firebase";
import images from "../../Assests/projectImages";
import LoginString from "../Login/Loginstring";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
      id: localStorage.getItem(LoginString.ID),
      name: localStorage.getItem(LoginString.Name),
      aboutMe: localStorage.getItem(LoginString.Description),
      photoUrl: localStorage.getItem(LoginString.PhotoURL),
    };
    this.newPhoto = null;
    this.newPhotoUrl = "";
  }
  componentDidMount() {
    if (!localStorage.getItem(LoginString.ID)) {
      this.props.history.push("/");
    }
  }
  onChangeName = (event) => {
    this.setState({
      name: event.target.value,
    });
  };
  onChangeAboutMe = (event) => {
    this.setState({
      aboutMe: event.target.value,
    });
    console.log(this.state);
  };
  onChangeAvatar = (event) => {
    if (event.target.files && event.target.files[0]) {
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
        this.props.showNotification(0, "This file is not an image");
        return;
      }
      this.newPhoto = event.target.files[0];
      this.setState({
        photoUrl: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      this.props.showNotification(0, "Something went wrong.");
    }
  };

  uploadAvatar = () => {
    this.setState({ isLoading: true });
    if (this.newPhoto) {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(this.state.id)
        .put(this.newPhoto);
      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.props.showNotification(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      this.updateUserInfo(false, null);
    }
  };
  updateUserInfo = (isUpdatedPhotoURL, downloadURL) => {
    let newinfo;
    if (isUpdatedPhotoURL) {
      newinfo = {
        name: this.state.name,
        Description: this.state.aboutMe,
        URL: downloadURL,
      };
    } else {
      newinfo = {
        name: this.state.name,
        Description: this.state.aboutMe,
      };
    }
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.documentKey)
      .update(newinfo)
      .then((data) => {
        localStorage.setItem(LoginString.Name, this.state.name);
        localStorage.setItem(LoginString.Description, this.state.aboutMe);
        if (isUpdatedPhotoURL) {
          localStorage.setItem(LoginString.PhotoURL, downloadURL);
        }
        this.setState({ isLoading: false });
        this.props.showNotification(1, "Updated!");
      });
  };
  render() {
    return (
      <div className="profileroot">
        <div className="headerprofile">
          <span>Profile</span>
        </div>
        {this.state.photoUrl ? (
          <img className="avatar" alt="" src={this.state.photoUrl} />
        ) : (
          <p className="avatar"></p>
        )}
        <div className="viewWrapInputFile">
          <img
            className="imgInputFile"
            alt="icon gallery"
            src={images.uploadImage}
            onClick={() => {
              this.refInput.click();
            }}
          />
          <input
            ref={(el) => {
              this.refInput = el;
            }}
            accept="image/*"
            className="viewInputFile"
            type="file"
            onChange={this.onChangeAvatar}
          />
        </div>
        <span className="textLabel">Name</span>
        <input
          className="textInput"
          value={this.state.name ? this.state.name : ""}
          placeholder="Your Name"
          onChange={this.onChangeName}
        />
        <span className="textLabel">About Me</span>
        <input
          className="textInput"
          value={this.state.aboutMe ? this.state.aboutMe : ""}
          placeholder="Describe yourself"
          onChange={this.onChangeAboutMe}
        />
        <div>
          <button className="btnUpdate" onClick={this.uploadAvatar}>
            Save
          </button>
          <button
            className="btnback"
            onClick={() => {
              this.props.history.push("/users");
            }}
          >
            Back
          </button>
          {this.state.isLoading ? (
            <div>
              <ReactLoading
                type={"spin"}
                color={"#203152"}
                height={"3%"}
                width={"3%"}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
