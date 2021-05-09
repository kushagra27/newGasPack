import firebase from "firebase/app";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyBp-M1wpceF9DEuUs6Q74KCI6TjbQqLeVk",
    authDomain: "gaspack-lite-62595.firebaseapp.com",
    projectId: "gaspack-lite-62595",
    storageBucket: "gaspack-lite-62595.appspot.com",
    messagingSenderId: "877603482903",
    appId: "1:877603482903:web:ff658ba91aa5c086a6db52",
    measurementId: "G-28ZHEGWH3H"
};

firebase.initializeApp(config);

var db = firebase.firestore();

export default db;