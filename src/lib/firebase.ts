// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPz8tAvvblpD60ktI3ayht8xBu5nG47LQ",
  authDomain: "thebestapp-c2729.firebaseapp.com",
  databaseURL: "https://thebestapp-c2729-default-rtdb.firebaseio.com",
  projectId: "thebestapp-c2729",
  storageBucket: "thebestapp-c2729.firebasestorage.app",
  messagingSenderId: "865760287115",
  appId: "1:865760287115:web:5a186d19e8dbd394c8378e",
  measurementId: "G-NNQ4JXN30W"
};

const app = initializeApp(firebaseConfig);

// Solo exporta lo necesario para usar en el servidor
export const db = getFirestore(app);
