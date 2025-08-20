import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase de la aplicación web del usuario
const firebaseConfig = {
  apiKey: "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U",
  authDomain: "rincon-de-lore.firebaseapp.com",
  projectId: "rincon-de-lore",
  storageBucket: "rincon-de-lore.appspot.com",
  messagingSenderId: "1023054561981",
  appId: "1:1023054561981:web:1a98228f741c1732cc2dd4",
  measurementId: "G-619DPFRWGS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);