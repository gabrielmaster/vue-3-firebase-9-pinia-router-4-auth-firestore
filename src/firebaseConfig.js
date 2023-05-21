import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB0fmgaGcnEx7TQe51dsTyHepBrt7yJHps",
  authDomain: "vue-3-2023-ff9a8.firebaseapp.com",
  projectId: "vue-3-2023-ff9a8",
  storageBucket: "vue-3-2023-ff9a8.appspot.com",
  messagingSenderId: "367525709773",
  appId: "1:367525709773:web:0ba6ddd054b230349ca684"
};

initializeApp(firebaseConfig);
const auth = getAuth();

export {
    auth,
}