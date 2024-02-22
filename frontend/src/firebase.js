// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRAAMyL5qQ5wK2gS4NHMjk1GVmmSVD2Is",
  authDomain: "cs490-ananas.firebaseapp.com",
  projectId: "cs490-ananas",
  storageBucket: "cs490-ananas.appspot.com",
  messagingSenderId: "355817163789",
  appId: "1:355817163789:web:99a8f8da64ed92f0c61944",
  measurementId: "G-HRBMXWQBN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()

const registerUserToMongo = async(name,email,uid) =>{
    const API_BASE_URL = process.env.NODE_ENV === 'production' ?
     window.location.origin:
     'http://localhost:3000';
    await fetch(`${API_BASE_URL}/api/register`,{
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            uid,
        }),
        headers:{
            "Content-type": "application/json"
        },
    })
    .then(() => {
        console.log("User registered");
    })
    .catch((err) => {
        console.log(err.message)
    })
};

const registerWithEmailAndPassword = async(name,email,password) => {
    try{
        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        await registerUserToMongo(name, email, user.uid)
    }catch (error){
        console.log(error.message);
    }
}
export { app , auth , registerWithEmailAndPassword };