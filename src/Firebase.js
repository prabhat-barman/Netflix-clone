import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  addDoc, 
  collection 
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC-dzvFROTjlj_lPzQpRCIh8WFUzs4-3JY",
  authDomain: "netflix-clone-efe30.firebaseapp.com",
  projectId: "netflix-clone-efe30",
  storageBucket: "netflix-clone-efe30.firebasestorage.app",
  messagingSenderId: "730857198281",
  appId: "1:730857198281:web:6a0318301e580de86fb318",
  measurementId: "G-M50BPYQPKR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });

  } catch (error) {
    console.error(error);
    toast.error(error.code);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
   toast.error(error.code);
  }
};


const logout = () => signOut(auth);

export { auth, db, login, signup, logout };
