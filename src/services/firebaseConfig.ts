import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDBj2DMTQiTgWuEeF-l3SHSU5XgKSHTQ_k",
    authDomain: "moneybridge-demo.firebaseapp.com",
    databaseURL: "https://moneybridge-demo-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "moneybridge-demo",
    storageBucket: "moneybridge-demo.firebasestorage.app",
    messagingSenderId: "447528912005",
    appId: "1:447528912005:web:d300ed5be9c7299b4855ec"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
