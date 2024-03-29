import React, { Component } from "react";
import LoginString from "../Login/Loginstring";
import firebase from "../../services/firebase";
import "./Users.css";
import ReactLoading from "react-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Chat from "../Chat/Chat";
import Greetings from "../Greetings/Greetings";

export default class Users extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      displayedContactSwitchedNotification: [],
      displayedContacts: [],
    };
    this.currentUserName = localStorage.getItem(LoginString.Name);
    this.currentUserId = localStorage.getItem(LoginString.ID);
    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL);
    this.currentUserMessages = [];
    this.searchUsers = [];
    this.notificationMessagesErase = [];
    this.currentUserDocumentId = localStorage.getItem(
      LoginString.FirebaseDocumentId
    );
  }
  logout = () => {
    firebase.auth().signOut();
    this.props.history.push("/");
    localStorage.clear();
  };
  onProfileClick = () => {
    this.props.history.push("/profile");
  };
  getListUser = async () => {
    const result = await firebase.firestore().collection("users").get();
    if (result.docs.length > 0) {
      let listUsers = [];
      listUsers = [...result.docs];
      listUsers.forEach((item, index) => {
        this.searchUsers.push({
          key: index,
          documentKey: item.id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          URL: item.data().URL,
          description: item.data().description,
        });
      });
      this.setState({
        isLoading: false,
      });
    }
    this.renderListUser();
  };

  getClassnameforUserandNotification = (itemId) => {
    let number = 0;
    let className = "";
    let check = false;
    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = "viewWrapItemFocused";
    } else {
      this.state.displayedContactSwitchedNotification.forEach((item) => {
        if (item.notificationId.length > 0) {
          if (item.notificationId === itemId) {
            check = true;
            number = item.number;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
      return className;
    }
  };

  notificationErase = (itemId) => {
    this.state.displayedContactSwitchedNotification.forEach((el) => {
      if (el.notificationId.length > 0) {
        if (el.notificationId !== itemId) {
          this.notificationMessagesErase.push({
            notificationId: el.notificationId,
            number: el.number,
          });
        }
      }
    });
    this.updaterenderList();
  };

  updaterenderList = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentUserDocumentId)
      .update({ messages: this.notificationMessagesErase });
    this.setState({
      displayedContactSwitchedNotification: this.notificationMessagesErase,
    });
  };

  renderListUser = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.searchUsers.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              key={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
              }}
            >
              {item.URL ? (
                <img className="viewAvatarItem" src={item.URL} alt="" />
              ) : (
                <p className="viewAvatarItem"></p>
              )}
              <div className="viewWrapContentItem">
                <span className="textItem">{item.name}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationpragraph">
                  <p id={item.key} className="newmessages">
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No user is present");
    }
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentUserDocumentId)
      .get()
      .then((doc) => {
        doc.data().messages.map((item) => {
          this.currentUserMessages.push({
            notificationId: item.notificationId,
            number: item.number,
          });
        });
        this.setState({
          displayedContactSwitchedNotification: this.currentUserMessages,
        });
      });
    this.getListUser();
  }
  searchHandler = (event) => {
    let searchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((el) => {
        let SearchValue = el.name.toLowerCase();
        return SearchValue.indexOf(searchQuery) !== -1;
      });
    this.state.displayedContacts = displayedContacts;
    this.displaySearchedContact();
  };
  displaySearchedContact = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.state.displayedContacts.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              key={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
              }}
            >
              {item.URL ? (
                <img className="viewAvatarItem" src={item.URL} alt="" />
              ) : (
                <p className="viewAvatarItem"></p>
              )}
              <div className="viewWrapContentItem">
                <span className="textItem">{item.name}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationpragraph">
                  <p id={item.key} className="newmessages">
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No user is present");
    }
  };
  render() {
    return (
      <div className="root">
        <div className="body">
          <div className="viewListUser">
            <div className="profileviewleftside">
              <img
                className="ProfilePicture"
                alt=""
                src={this.currentUserPhoto}
                onClick={this.onProfileClick}
              />
              <button className="Logout" onClick={this.logout}>
                Logout
              </button>
            </div>
            <div className="rootsearchbar">
              <div className="input-container">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  className="input-field"
                  type="text"
                  onChange={this.searchHandler}
                  placeholder="Search"
                />
              </div>
            </div>
            {this.state.displayedContacts}
          </div>
          <div className="viewBoard">
            {this.state.currentPeerUser ? (
              <Chat />
            ) : (
              <Greetings
                currentUserName={this.currentUserName}
                currentUserPhoto={this.currentUserPhoto}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
