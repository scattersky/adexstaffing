import {getApp, getApps, initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyy7LtugEa_u6Iwb3Th3V32pLqaU-y5KQ",
  authDomain: "adex-26147.firebaseapp.com",
  projectId: "adex-26147",
  storageBucket: "adex-26147.firebasestorage.app",
  messagingSenderId: "411198301125",
  appId: "1:411198301125:web:4b646eb845050c78a4a1ac",
  measurementId: "G-NXQDJXP450"
};

// Prevent re-initializing in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };