// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup , GoogleAuthProvider, GithubAuthProvider, AuthErrorCodes} from "firebase/auth";
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


const thirdPartySignin = async(provider) => {
    try {
        const response = await signInWithPopup(auth, provider );
        const user = response.user;
        return {name: user.displayName, email:user.email, uid:user.uid}
    } catch (error){
        throw error;
    }   
}

const registerWithEmailAndPassword = async(name,email,password) => {
    try{
        if (name === '' || email === '' || password ==='') {
            throw Error("Please fill in all fields!")
        }
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false ){
            throw Error("Invalid email!")
        }
        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        return user.uid
        // await registerUserToMongo(name, email, user.uid)
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
       const {name, email ,uid }= await thirdPartySignin(googleProvider);
       return {name:name, email: email,uid:uid}
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
        const {name, email ,uid}  = await thirdPartySignin(githubProvider);
        return {name:name, email: email,uid:uid}
    } catch (error) {
        console.log(error)
        if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)){
            throw Error("This email is in use through different service!")
        }else{
            throw error;
        }
    }

}

const logInWithEmailAndPassword = async(email, password) => {
    try{
        if ( email === '' || password === '') {
            throw Error("Please fill in all fields!")
        }
        const response = await signInWithEmailAndPassword(auth, email, password)
        const user = response.user
        return user.uid
    }catch(error){
        console.log(error.message)
        if (error.message.includes(AuthErrorCodes.INVALID_IDP_RESPONSE)){
            throw Error("The email and/or password you entered is incorrect!")
        }else{
            throw error;
        }
    }
}

export { app , auth , registerWithEmailAndPassword, signInWithGoogle, signInWithGithub, logInWithEmailAndPassword};