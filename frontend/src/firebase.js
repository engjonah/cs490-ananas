// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification, multiFactor, getMultiFactorResolver, RecaptchaVerifier, PhoneMultiFactorGenerator, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, AuthErrorCodes, updatePassword, deleteUser, sendPasswordResetEmail, PhoneAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig;
//prod
if (process.env.REACT_APP_RELEASE_STAGE === 'prod') {
    firebaseConfig = {
        apiKey: "AIzaSyDnDpX4ZMVDmFmKn0_WGIcjvLGlxreS5-A",
        authDomain: "cs490-ananas-prod.firebaseapp.com",
        projectId: "cs490-ananas-prod",
        storageBucket: "cs490-ananas-prod.appspot.com",
        messagingSenderId: "81408202038",
        appId: "1:81408202038:web:4ff2d02cb7ebe2f6ab4f97"
    };
}
//beta, localhost, reviewapps
else {
    firebaseConfig = {
        apiKey: "AIzaSyCRAAMyL5qQ5wK2gS4NHMjk1GVmmSVD2Is",
        authDomain: "cs490-ananas.firebaseapp.com",
        projectId: "cs490-ananas",
        storageBucket: "cs490-ananas.appspot.com",
        messagingSenderId: "355817163789",
        appId: "1:355817163789:web:99a8f8da64ed92f0c61944",
        measurementId: "G-HRBMXWQBN4"
    };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function initRecaptcha() {
    if (!window.verifier) {
        window.verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
        });
    }
}

function setRecaptchaVisibility(visible) {
    const element = document.getElementById('recaptcha-container');
    if (element) {
        element.style.visibility = visible ? 'visible' : 'hidden';
    } else {
        console.error('Recaptcha container not found in the DOM.');
    }
}


const thirdPartySignin = async (provider) => {
    try {
        const response = await signInWithPopup(auth, provider);
        const user = response.user;
        return { name: user.displayName, email: user.email, uid: user.uid }
    } catch (error) {
        throw error;
    }
}

const enrollUserMfaBack = async (phone) => {
    try {
        var user = auth.currentUser;
        const multiFactorSession = await multiFactor(user).getSession();
        const phoneInfoOptions = {
            phoneNumber: phone,
            session: multiFactorSession
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.verifier);
        return verificationId;
    } catch (error) {
        if (error.code === 'auth/unverified-email') {
            await sendEmailVerification(user);
            throw new Error("Email not verified");
        } else if (error.code === 'auth/requires-recent-login') {
            //ignore for now
        } else {
            throw new Error("Could not setup mfa: ", error);
        }
    }
}

const enrollPhone = async (verificationId, verificationCode) => {
    var user = auth.currentUser;
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    return multiFactor(user).enroll(multiFactorAssertion, 'phone');
}

const handleMultiFactorAuth = async (error) => {
    const resolver = getMultiFactorResolver(auth, error);
    if (!resolver.hints || resolver.hints.length === 0 || resolver.hints[0].factorId !== PhoneMultiFactorGenerator.FACTOR_ID) {
        throw new Error("MFA is required but no methods are available.");
    }
    const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session
    };
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.verifier);
    return [resolver, verificationId];
};

const verifyCode = async (resolver, verificationId, verificationCode) => {
    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    return resolver.resolveSignIn(multiFactorAssertion);
};

const registerWithEmailAndPassword = async (name, email, password, password2) => {
    try {
        if (name === '' || email === '' || password === '' || password2 === '') {
            throw Error("Please fill in all fields!")
        }
        if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) === false) {
            throw Error("Invalid email!")
        }
        if (password !== password2) {
            throw Error("Passwords do not match!")
        }
        const response = await createUserWithEmailAndPassword(auth, email, password)
        const user = response.user
        await sendEmailVerification(user);
        return user.uid
        // await registerUserToMongo(name, email, user.uid)
    } catch (e) {
        console.log(e.message);
        if (e.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
            throw Error("Please choose a stronger password!")
        } else if (e.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
            throw Error("This email is already in use!")
        } else if (e.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
            throw Error("Invalid email!")
        } else {
            throw e;
        }
    }
}

const signInWithGoogle = async () => {
    try {
        const { name, email, uid } = await thirdPartySignin(googleProvider);
        return { name, email, uid };
    } catch (error) {
        if (error.code === 'auth/multi-factor-auth-required') {
            const [resolver, verificationId] = await handleMultiFactorAuth(error);
            const customError = new Error("Multi-factor authentication required");
            customError.resolver = resolver;
            customError.verificationId = verificationId;
            throw customError;
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
        } else {
            throw error;
        }
    }
};
const signInWithGithub = async () => {
    try {
        const { name, email, uid } = await thirdPartySignin(githubProvider);
        return { name: name, email: email, uid: uid }
    } catch (error) {
        if (error.code === 'auth/multi-factor-auth-required') {
            const [resolver, verificationId] = await handleMultiFactorAuth(error);
            const customError = new Error("Multi-factor authentication required");
            customError.resolver = resolver;
            customError.verificationId = verificationId;
            throw customError;
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
        } else {
            throw error;
        }
    }
}

const logInWithEmailAndPassword = async (email, password) => {
    try {
        if (email === '' || password === '') {
            throw Error("Please fill in all fields!")
        }
        const response = await signInWithEmailAndPassword(auth, email, password)
        const user = response.user
        return user.uid
    } catch (error) {
        if (error.code === 'auth/multi-factor-auth-required') {
            const [resolver, verificationId] = await handleMultiFactorAuth(error);
            const customError = new Error("Multi-factor authentication required");
            customError.resolver = resolver;
            customError.verificationId = verificationId;
            throw customError;
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
        } else if (error.name === 'TimeoutError') {
            console.error("Timeout occurred:", error);
            throw new Error("Request timed out, please try again later.");
        } else {
            throw error;
        }
    }
}

const firebaseOnlyUser = async () => {
    try {
        await auth.authStateReady();
        var user = auth.currentUser;
        if (user && user.providerData[0].providerId === 'password') {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking firebase provider:", error);
    }
}

const changePassword = async (newPassword) => {
    try {
        // Get the currently signed-in user
        var user = auth.currentUser;
        console.log(user)
        console.log(user.providerData[0].providerId)
        // Replace the user's password
        await updatePassword(user, newPassword);
        return true;

    } catch (e) {

        if (e.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
            throw Error("Please choose a stronger password!")
        } else {
            throw e;
        }
        // An error occurred while updating password
    }
};

const deleteAccount = async () => {
    try {
        var user = auth.currentUser;
        await deleteUser(user);
    } catch (error) {
        console.error("Could not delete user: ", error);
    }
}

const resetPasswordEmail = async (email) => {
    try {
        // Send the user's password
        await sendPasswordResetEmail(auth, email);


    } catch (error) {
        // An error occurred while updating password
        throw new Error("Error updating password:", error);
    }
}

async function checkUserMFA() {
    await auth.authStateReady();
    var user = auth.currentUser;
    if (user) {
        // Check if there are any enrolled factors
        const mfaEnabled = user.reloadUserInfo && user.reloadUserInfo.mfaInfo && user.reloadUserInfo.mfaInfo.length > 0;
        return mfaEnabled;
    } else {
        // If no user is signed in, return false
        console.error('No user is currently signed in.');
        return false;
    }
}

export { app, auth, enrollPhone, checkUserMFA, setRecaptchaVisibility, initRecaptcha, registerWithEmailAndPassword, signInWithGoogle, signInWithGithub, logInWithEmailAndPassword, changePassword, firebaseOnlyUser, deleteAccount, resetPasswordEmail, RecaptchaVerifier, signInWithPhoneNumber, enrollUserMfaBack, verifyCode };
