// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAphbWQLyVQCn5__ZbLH9JioF--g7MrgVs",
  authDomain: "sad-queue.firebaseapp.com",
  projectId: "sad-queue",
  storageBucket: "sad-queue.firebasestorage.app",
  messagingSenderId: "89448854015",
  appId: "1:89448854015:web:38124c50c0efe134b4f7ca",
  measurementId: "G-F3RZFBTDEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}