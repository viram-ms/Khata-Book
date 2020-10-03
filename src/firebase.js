import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDgOhLUbR7_jAkWZ5KszYfrpkr-YVPmbeM",
  authDomain: "khata-book-8281b.firebaseapp.com",
  databaseURL: "https://khata-book-8281b.firebaseio.com",
  projectId: "khata-book-8281b",
  storageBucket: "khata-book-8281b.appspot.com",
  messagingSenderId: "28160728362",
  appId: "1:28160728362:web:22b73fe071f06dae885253"
};

const fireBaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;