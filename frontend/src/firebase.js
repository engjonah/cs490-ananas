// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup , GoogleAuthProvider, GithubAuthProvider, AuthErrorCodes} from "firebase/auth";
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

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

const thirdPartySignin = async(provider) => {
    try {
        const response = await signInWithPopup(auth, provider );
        const user = response.user;
        await registerUserToMongo(user.displayName, user.email, user.uid);
    } catch (error){
        throw error;
    }   
}

const registerWithEmailAndPassword = async(name,email,password) => {
    try{
        if (name == '' || email == '' || password=='') {
            throw Error("Please fill in all fields!")
        }
        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        await registerUserToMongo(name, email, user.uid)
    }catch (e){
        console.log(e.message);
        if (e.message.includes(AuthErrorCodes.WEAK_PASSWORD)){
            throw Error("Please choose a stronger password!")
        }else if (e.message.includes(AuthErrorCodes.EMAIL_EXISTS)){
            throw Error("This email is already in use!")
        }else if (e.message.includes(AuthErrorCodes.INVALID_EMAIL)){
            throw Error("Invalid email!")
        }else {
            throw e;
        }
    }
}

const signInWithGoogle = async() => {
    try{
       await thirdPartySignin(googleProvider);
    }catch (error){
        console.log(error);
        if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)){
            throw Error("This email is in use through different service!")
        }else{
            throw error;
        }
    }
}

const signInWithGithub = async() => {
    try {
        await thirdPartySignin(githubProvider);
    } catch (error) {
        console.log(error)
        if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)){
            throw Error("This email is in use through different service!")
        }else{
            throw error;
        }
    }

}
export { app , auth , registerWithEmailAndPassword, signInWithGoogle, signInWithGithub };