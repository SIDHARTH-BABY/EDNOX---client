// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from  'firebase/firestore'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxc6Gm0ShRBmcbNPoHVHsUfN5wOBLnEiI",
  authDomain: "social-media-6f0fb.firebaseapp.com",
  projectId: "social-media-6f0fb",
  storageBucket: "social-media-6f0fb.firebasestorage.app",
  messagingSenderId: "559795995964",
  appId: "1:559795995964:web:15ec24ae9e6b235d890a39",
  measurementId: "G-HVBMM9THZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const imgStorage = getStorage(app)
export default app
export const googleProvider = new GoogleAuthProvider()
