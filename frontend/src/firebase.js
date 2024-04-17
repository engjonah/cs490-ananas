// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, multiFactor, getMultiFactorResolver, RecaptchaVerifier, PhoneMultiFactorGenerator, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, AuthErrorCodes, updatePassword, deleteUser, sendPasswordResetEmail, PhoneAuthProvider } from "firebase/auth";

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


const thirdPartySignin = async (provider) => {
    try {
        const response = await signInWithPopup(auth, provider);
        const user = response.user;
        return { name: user.displayName, email: user.email, uid: user.uid }
    } catch (error) {
        throw error;
    }
}

const handleMultiFactorAuth = async (error, recaptchaVerifier) => {
    const resolver = getMultiFactorResolver(auth, error);
    if (!resolver.hints || resolver.hints.length === 0 || resolver.hints[0].factorId !== PhoneMultiFactorGenerator.FACTOR_ID) {
        throw new Error("MFA is required but no methods are available.");
    }
    const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session
    };
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    const verificationCode = window.prompt('Please enter the verification code sent to your device');
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

const signInWithGoogle = async (recaptchaVerifier) => {
    try {
        const { name, email, uid } = await thirdPartySignin(googleProvider);
        return { name, email, uid };
    } catch (error) {
        console.log(error);
        if (error.code === 'auth/multi-factor-auth-required') {
            const userCredential = await handleMultiFactorAuth(error, recaptchaVerifier);
            return { email: userCredential.user.email, uid: userCredential.user.uid };
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
        } else {
            throw error;
        }
    }
};
const signInWithGithub = async (recaptchaVerifier) => {
    try {
        const { name, email, uid } = await thirdPartySignin(githubProvider);
        return { name: name, email: email, uid: uid }
    } catch (error) {
        console.log(error);
        if (error.code === 'auth/multi-factor-auth-required') {
            const userCredential = await handleMultiFactorAuth(error, recaptchaVerifier);
            return { email: userCredential.user.email, uid: userCredential.user.uid };
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
        } else {
            throw error;
        }
    }
}

const logInWithEmailAndPassword = async (email, password, recaptchaVerifier) => {
    try {
        if (email === '' || password === '') {
            throw Error("Please fill in all fields!")
        }
        const response = await signInWithEmailAndPassword(auth, email, password)
        const user = response.user
        return user.uid
    } catch (error) {
        console.log(error);
        if (error.code === 'auth/multi-factor-auth-required') {
            const userCredential = await handleMultiFactorAuth(error, recaptchaVerifier);
            return { email: userCredential.user.email, uid: userCredential.user.uid };
        } else if (error.message.includes(AuthErrorCodes.NEED_CONFIRMATION)) {
            throw new Error("This email is in use through a different service!");
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
        console.error("Error updating password:", error);
    }
}

const enrollUserMfaBack = async (phone, user, recaptchaVerifier) => {
    try {
        console.log("get user session")
        console.log(user)
        console.log(multiFactor(user).getSession());
        /*multiFactor(user).getSession().then(function (multiFactorSession) {
            // Specify the phone number and pass the MFA session.
            const phoneInfoOptions = {
                phoneNumber: phone,
                session: multiFactorSession
            };

            const phoneAuthProvider = new PhoneAuthProvider(auth);
            // Send SMS verification code.
            return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        }).then(function (verificationId) {
            const verificationCode = window.prompt('Please enter the verification code sent to your device');
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

            // Complete enrollment.
            return multiFactor(user).enroll(multiFactorAssertion, "Phone");
        });
        
        const multiFactorSession = multiFactor(user).getSession();
        console.log("session got")
        const phoneInfoOptions = {
            phoneNumber: phone,
            session: multiFactorSession
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);

        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        const verificationCode = window.prompt('Please enter the verification code sent to your device');
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        return multiFactor(user).enroll(multiFactorAssertion, user.displayName);*/
    } catch (error) {
        console.error("Could not setup mfa: ", error);
    }
}

export { app, auth, registerWithEmailAndPassword, signInWithGoogle, signInWithGithub, logInWithEmailAndPassword, changePassword, firebaseOnlyUser, deleteAccount, resetPasswordEmail, RecaptchaVerifier, signInWithPhoneNumber, enrollUserMfaBack };
