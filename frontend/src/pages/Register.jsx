import React, { useEffect, useRef, useState } from 'react'
import addImg from "../images/gallery.png"
import doneimg from "../images/checked.png";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../firebase";
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import logo from '../images/meetme2.png';
import {BASE_URL} from "../portFile";

const Register = () => {

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picURL, setPicURL] = useState("");
  const [firebaseID, setFirebaseID] = useState("");
  const [loading, setLoading]=useState(false);
  //const [state, setState]=useState(0);
  const previousValues = useRef({ firebaseID, picURL });

  const [file, setFile] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{

    const saveDB = async () => {
      let response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({ name, email, picURL, firebaseID }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      response = await response.json();

      if (response.error) {
        setError(true);
        setErrorMsg(response.error);
      }
      else {
        navigate("/chats")
      }
    }

    
    if(previousValues.current.firebaseID!==firebaseID && previousValues.current.picURL!==picURL)
    {
      saveDB();
    }

  }, [firebaseID, picURL])

  const handleSubmit = async (e) => {

    e.preventDefault();

    setName(e.target[0].value);
    setEmail(e.target[1].value);
    setPassword(e.target[2].value);

    if (!email || !name || !password) {
      setError(true);
      setErrorMsg("Invalid request body. Must contain email, password, and name for user.");
      return;
    }

    if (!e.target[3].value) {
      setError(true);
      setErrorMsg("Avatar pic not selected.");
      return;
    }
    if (password.length < 6) {
      setError(true);
      setErrorMsg("Weak password! Ahould be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const firebaseUser = createUserWithEmailAndPassword(auth, email, password);

      setFirebaseID((await firebaseUser).user.uid);

      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(e.target[3].files[0], options);
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);


      uploadTask.on('state_changed',
        (snapshot) => {
        },
        (error) => {
          setError(true);
          setErrorMsg("Something went wrong !!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setPicURL(downloadURL);
            await updateProfile(auth.currentUser, {
              displayName: name,
              photoURL: downloadURL
            })
          });
        });
    }
    catch (err) {
      setError(true);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Email already exists!!");
      }
      else {
        setErrorMsg("Something went wrong!!");
      }
      return;
    }

  }

  return (
    <div className="formContainer">
      <div className='formWrapper'>
        <span className='logo'><img className='logoImg' src={logo}/><span className='logoName'>ChatBlink</span></span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>

          <input type="text" placeholder='Display Name' onChange={(e) => setName(e.target.value)} />

          <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />

          <input style={{ display: 'none' }} type="file" id='file' onChange={(e) => setFile(e.target.value)} />

          <label htmlFor='file'>
            <img src={addImg} alt="" />
            <span>Add an avatar</span>
            {file && <span><img className='img_done' src={doneimg} alt="" /></span>}
          </label>

          <button>{loading?<>Signing Up...</>:<>Sign Up</>}</button>

          {error && <span className='error'>{errorMsg}</span>}
        </form>
        <p>You do have an account? <Link to="/login">Login</Link> </p>
      </div>
    </div>
  )
}
export default Register;
