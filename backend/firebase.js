const dotenv =require("dotenv");

dotenv.config();
const { initializeApp } =require("firebase/app");
const { getAuth } =require("firebase/auth");
const {getStorage}=require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MSG_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASEUREMENT_ID
};

const app = initializeApp(firebaseConfig);
module.exports= app;

const auth=getAuth();
module.exports=  auth;

const storage = getStorage();
module.exports=storage;
