import React, { useEffect, useContext, useRef } from 'react'
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Home = () => {

  const { currentUser } = useContext(AuthContext);
  const socket=useRef();

  useEffect(()=>{
    socket.current=io("https://chatblink-backend.onrender.com");
  },[])

  useEffect(()=>{
    if(!socket)
      return;
    socket.current.on('connect', ()=>{
      socket.current.emit("sendUser", currentUser.uid);
      socket.current.emit("getOnline", currentUser.uid);
    })
  },[currentUser])

  return (
    <div className='home'>
      <div className='container'>
        <Sidebar socket={socket}/>
        <Chat socket={socket}/>
      </div>
    </div>
  )
}

export default Home
