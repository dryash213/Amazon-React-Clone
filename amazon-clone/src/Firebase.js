// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAREaJ-ukYkzA1J9ExKdgyDBkyPZQEi6SM",
    authDomain: "challenge-45e21.firebaseapp.com",
    projectId: "challenge-45e21",
    storageBucket: "challenge-45e21.appspot.com",
    messagingSenderId: "205214816131",
    appId: "1:205214816131:web:eab4446a67b2344f78c8b6",
    measurementId: "G-K6Z5XB856Y"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export {db,auth};