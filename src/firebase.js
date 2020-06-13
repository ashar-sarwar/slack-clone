import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyB8kU8tAbNp2phUVMnG55Ym82AZHzGHcaw",
  authDomain: "slack-292f6.firebaseapp.com",
  databaseURL: "https://slack-292f6.firebaseio.com",
  projectId: "slack-292f6",
  storageBucket: "slack-292f6.appspot.com",
  messagingSenderId: "949898726639",
  appId: "1:949898726639:web:d05c655372a7a29edf5f1a",
  measurementId: "G-R2CK9K2MH4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
