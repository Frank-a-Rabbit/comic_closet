import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

const firebaseConfig = {
    apiKey: 'AIzaSyA6bjf8E7W4KYrDwU1kQ0-nsOJDJfuQbU8',
    authDomain: 'legends-league-a7809.firebaseapp.com',
    databaseURL: 'https://legends-league-a7809.firebaseio.com',
    projectId: 'legends-league-a7809',
    storageBucket: 'legends-league-a7809.appspot.com',
    messagingSenderId: '281052354601',
    appId: '1:281052354601:web:c70098ac856ad608542438'
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    console.log("no")
}

const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
const FacebookAuthProvider = new firebase.auth.FacebookAuthProvider()
const signInWithPopup = firebase.auth().signInWithPopup
const databaseConnection = firebase.firestore();
const auth = firebase.auth();

export { databaseConnection, auth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, firebase }