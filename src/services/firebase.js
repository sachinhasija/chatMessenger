import * as firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyABP1uNsV0PL8mw4_BLiecL_5-QWw4eCFQ",
  authDomain: "webchatapp-b3348.firebaseapp.com",
  databaseURL: "https://webchatapp-b3348.firebaseio.com",
  projectId: "webchatapp-b3348",
  storageBucket: "webchatapp-b3348.appspot.com",
  messagingSenderId: "595970383358",
  appId: "1:595970383358:web:cd9e89480ee2b7c903f4af",
  measurementId: "G-LPDW8MGP49",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
