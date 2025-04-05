import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmt2G1cRXNmcLThu5Q7NVfOVLuJ7xsBN8",
  authDomain: "gerenciador-senhas-39bdc.firebaseapp.com",
  projectId: "gerenciador-senhas-39bdc",
  storageBucket: "gerenciador-senhas-39bdc.appspot.com",
  messagingSenderId: "1092938336599",
  appId: "1:1092938336599:web:d2fc0510815e22d2ee9612",
  measurementId: "G-G1VP75CCQR",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app)
const provider = new GoogleAuthProvider();

export { auth, provider, db };