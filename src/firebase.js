import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Unified Firebase project — same as admin dashboard (hotel-frontend-d7ed9)
// This ensures orders placed by customers are visible in the admin panel.
const firebaseConfig = {
  apiKey: "AIzaSyDPOCPfX1-tB0BfSfku8Oer4tY9foqGE8s",
  authDomain: "hotel-frontend-d7ed9.firebaseapp.com",
  databaseURL: "https://hotel-frontend-d7ed9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hotel-frontend-d7ed9",
  storageBucket: "hotel-frontend-d7ed9.firebasestorage.app",
  messagingSenderId: "798480327393",
  appId: "1:798480327393:web:20595c31712479a92e0da0",
  measurementId: "G-VR3V6QTKSQ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
