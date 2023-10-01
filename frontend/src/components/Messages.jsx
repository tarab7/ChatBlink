import React, { Suspense, lazy, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../firebase";
import removeImg from "../images/x-button.png";
import Attach from "../images/attachment.png";
import AddImg from "../images/add-image.png";
import send from "../images/send.png";
import {io} from "socket.io-client";
import {BASE_URL} from "../portFile";
import imageCompression from 'browser-image-compression';
const ChatMessages=lazy(()=> import ('./ChatMessages'));

const Messages = ({socket}) => {

  const [text, setText]=useState("");
  const [img, setImg]=useState("");
  const [message, setMessage]=useState(null);
  const { currentUser } = useContext(AuthContext);
  const[messages, setMessages]=useState([]);
  const {data}=useContext(ChatContext);
  const [progress, setProgress]=useState("");
  

  //-------------------SOCKET IO FUNCTIONING-----------------------

  const [arrivalMsg, setArrivalMsg]=useState(null);
  //console.log(props.socket)
  //const socket=props.socket.current;

  useEffect(()=>{
    socket.current && socket.current.on("getMessage",(d)=>{
      setArrivalMsg({
        conversationId: data.conversationId,
        sender: d.senderId,
        text: d.text,
        img:d.img,
        createdAt: Date.now()
      });
    })
  },[])

  useEffect(()=>{
    arrivalMsg && data.user.firebaseId===arrivalMsg.sender && setMessages((prev)=>[...prev, arrivalMsg]);
  },[arrivalMsg])

  //-------------------SOCKET IO FINISHED-----------------------------
  



  //Current conversation Id jo ChatContext se aayi hai usko use krke chats DB me se messages nikalo 
  useEffect(()=>{
    const getMessages=async ()=>{
      try{
        let result=await fetch(`${BASE_URL}/api/message/${data.conversationId}`);
        result=await result.json();
        setMessages(result);
      }
      catch(err){
        console.log(err);
      }
    }
    getMessages();
  },[data.conversationId])

  
  useEffect(()=>{
    const saveDB=async()=>{
      try{
        let result=await fetch(`${BASE_URL}/api/message/`,{
          method:"POST",
          body: JSON.stringify(message),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result=await result.json();
        setMessages([...messages, result])
        setMessage(null);
        if(!result){
          return;
        }

        let result2=await fetch(`${BASE_URL}/api/conversation/updateText/${data.conversationId}`,{
          method:"PUT",
          body: JSON.stringify({text: text==="" && img? "@Photo":text}),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result2=await result2.json();
        setText("");
        setImg("");
        setProgress("");
      }
      catch(err){
        console.log(err);
      }
    }
    if(message){
      saveDB();
    }
  },[message]);

  

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!img && text===""){
      return;
    }
    if(img && img['type'].split('/')[0] !== 'image'){
      alert("ChatBlink only supports sending Image files only.");
      return;
    }
    //------------Socket Io sending Message-------------------------
    socket.current && socket.current.emit("sendMessage",{
      senderId:currentUser.uid, 
      receiverId: data.user.firebaseId,
      text:text,
      img:img,
      conversationId: data.conversationId
    })
    //--------------------------------------------------------------

    if(img){

      // Image compression
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (prcnt)=>{
          setProgress(`${prcnt}%`);
        }
      };
      
      try{
        const compressedFile = await imageCompression(img, options);        
        const storageRef = ref(storage, `photos/${Date.now()}_${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setMessage({
              conversationId:data.conversationId,
              sender:currentUser.uid,
              text:text,
              img:downloadURL
            })
          });
        });
      }
      catch(err){
        console.log(err);
      }
    }
    else if(text!=""){
      setMessage({
        conversationId:data.conversationId,
        sender:currentUser.uid,
        text:text,
        img:""
      })
    }

  }
    

  return (
    <>
    <Suspense fallback={<div className='messages'>Messages loading...</div>}>
      <ChatMessages messages={messages}/>
    </Suspense>

    <div className='input'>
      <input type="text" onChange={(e)=>setText(e.target.value)} value={text} placeholder="Type something..."  onKeyDown={(e) => e.code === "Enter" ? handleSubmit(e) : null}/>
      <div className='send'>
        <img src={Attach} alt=""/>

        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>

        {img?
        <>
          {progress===""?<img className='img_done' src={removeImg} onClick={()=>setImg("")} alt=""/>:<span className='prcnt'>{progress}</span>}
        </>:
        <label htmlFor='file'>
          <img src={AddImg} alt=""/>
        </label>
        }
        <button className='btnSend' onClick={handleSubmit}>
          Send
        </button>
        <button className='btnArrow' onClick={handleSubmit}>
          <img src={send} alt=""/>
        </button>
      </div>
    </div>
    </>
  )
}

export default Messages
