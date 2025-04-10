// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpymJ2Jcq4AOoRnZwtKC18sABMK0aDzKk",
  authDomain: "login-auth-290da.firebaseapp.com",
  projectId: "login-auth-290da",
  storageBucket: "login-auth-290da.firebasestorage.app",
  messagingSenderId: "218285770468",
  appId: "1:218285770468:web:38e4612ce19264dfe84ef1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db=getFirestore(app);
export default app;