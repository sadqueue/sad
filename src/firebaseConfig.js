// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import CONFIG1 from "./config";
const CONFIG = CONFIG1;

const firebaseConfig = {
    apiKey: CONFIG.REACT_APP_FIREBASE_API_KEY,
    authDomain: CONFIG.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: CONFIG.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: CONFIG.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: CONFIG.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: CONFIG.REACT_APP_FIREBASE_APP_ID,
    measurementId: CONFIG.REACT_APP_FIREBASE_MEASUREMENT_ID

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

export default db;
