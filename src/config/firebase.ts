import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDbX46Lt_ExVi534l98WaoU5EeKYpZZhC4",
  authDomain: "employeeregistration-7aec5.firebaseapp.com",
  projectId: "employeeregistration-7aec5",
  storageBucket: "employeeregistration-7aec5.firebasestorage.app",
  messagingSenderId: "561685912204",
  appId: "1:561685912204:web:1e988b8fca9b0cbaedb9a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar os serviços
export const db = getFirestore(app);
export const auth = getAuth(app); 