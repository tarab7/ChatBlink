import React, {useContext} from 'react'
import {auth} from "../firebase";
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import logo from '../images/meetme.png';

const Navbar = ({socket}) => {
  const { currentUser } = useContext(AuthContext);
  const {dispatch}=useContext(ChatContext);
  const navigate=useNavigate();

  const handleLogout=async()=>{
    try{
      dispatch({"type":"CHANGE_USER", payload:{}, payload2:"null"});
      await signOut(auth);
      socket.current && socket.current.disconnect();
      navigate("/login");
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <div className='navbar'>
      <span className='logo'><img className='logoImg' src={logo}/><span className='logoName'>ChatBlink</span></span>
      <div className='user'>
        <img src={currentUser.photoURL} alt=""/>
        <span>{currentUser.displayName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
