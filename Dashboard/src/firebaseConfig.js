import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDXYK93JXH0xmm8gw_y9gnS1EfRf0I48yI",
  authDomain: "dashboard-feb7f.firebaseapp.com",
  projectId: "dashboard-feb7f",
  storageBucket: "dashboard-feb7f.firebasestorage.app",
  messagingSenderId: "1081909267600",
  appId: "1:1081909267600:web:202036fdf2125970e85c15",
  measurementId: "G-0S7J9C3GWB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);