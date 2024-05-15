import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5fFUPJaSnQ9th8WfPf4qyR3_4Ay19sDE",
  authDomain: "red-neuronal-1e524.firebaseapp.com",
  projectId: "red-neuronal-1e524",
  storageBucket: "red-neuronal-1e524.appspot.com",
  messagingSenderId: "803155646658",
  appId: "1:803155646658:web:7def7715add567f64c035b",
  measurementId: "G-1DWT3H3CN4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
