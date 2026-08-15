import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD19HSEfMP4mrdxDWUkLMBB1rB1ovjAGEQ",
  authDomain: "my-study-platform-cc9cf.firebaseapp.com",
  projectId: "my-study-platform-cc9cf",
  storageBucket: "my-study-platform-cc9cf.firebasestorage.app",
  messagingSenderId: "1034729804113",
  appId: "1:1034729804113:web:537af112e7ea391dc24370",
  measurementId: "G-6NY1NC97VH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const db = getFirestore(app);
export const auth = getAuth(app);
