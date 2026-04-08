import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYNSLrTEAZz1lcqlKS5rSlHtCoZXj1W6I",
  authDomain: "jornal-74e5f.firebaseapp.com",
  projectId: "jornal-74e5f",
  storageBucket: "jornal-74e5f.firebasestorage.app",
  messagingSenderId: "701839108992",
  appId: "1:701839108992:web:ef96c94139fd6ed046af65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);