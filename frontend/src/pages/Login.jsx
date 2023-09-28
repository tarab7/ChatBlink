import React, { useContext, useState } from 'react'
import {auth} from "../firebase";
import {browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../images/meetme2.png';

const Login = () => {
  const [error, setError]=useState(false);
  const [errorMsg, setErrorMsg]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const navigate=useNavigate();
  const [loading, setLoading]=useState(false);
  const {currentUser}=useContext(AuthContext);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!email || !password){
      setError(true);
      setErrorMsg("Invalid request body. Must contain email and password for login.");
      return;
    }
    try{
      setLoading(true);
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chats");
    }
    catch(error){
      setLoading(false);
      setError(true);
      //console.log(error.code);
      if(error.code==="auth/user-not-found"){
        setErrorMsg("This user does not exists!!");
      }
      else if(error.code==="auth/wrong-password")
      {
        setErrorMsg("Incorrect Password!!");
      }
      else{
        setErrorMsg("Something went wrong!!");
      }
    }
  }

  return (
    <div className="formContainer">
      <div className='formWrapper'>
      <span className='logo'><img className='logoImg' src={logo}/><span className='logoName'>ChatBlink</span></span>
      <span className='title'>Login</span>
        <form>
            <input type="email" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' onChange={(e)=> setPassword(e.target.value)}/>
            <button onClick={handleSubmit}>{loading?<>Logging in...</>:<>Log In</>}</button>
            {error && <span className='error'>{errorMsg}</span>}
        </form>
        <p>You don't have an account? <Link to="/">Register</Link></p>
      </div>
    </div>
  )
}
export default Login;
