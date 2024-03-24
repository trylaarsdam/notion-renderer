// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBEjbAeH-i99kh-Jm8Ze6XrGN93Mfip_rk",
	authDomain: "lms-backend-9f431.firebaseapp.com",
	projectId: "lms-backend-9f431",
	storageBucket: "lms-backend-9f431.appspot.com",
	messagingSenderId: "7015165916",
	appId: "1:7015165916:web:56f3e0e1611a6fa4db2919",
	measurementId: "G-8CEFS10SDW"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Firebase Authentication and get a reference to the service
  export const auth = getAuth(app);
  export default app;