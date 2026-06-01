import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGVShOMjPdHGC8xXO97qJ8Bngke5Kjej0",
  authDomain: "todolist-65183.firebaseapp.com",
  projectId: "todolist-65183",
  storageBucket: "todolist-65183.firebasestorage.app",
  messagingSenderId: "400075727478",
  appId: "1:400075727478:web:ce49a0fc5c2afb818ef557",
};

// Si Metro hace hot reload, Firebase ya existe — getApp() evita el error "missing apiKey"
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Igual con auth: solo se inicializa con AsyncStorage la primera vez
export const auth =
  getApps().length === 1
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);

export default app;
