import React, { useContext, useRef, useEffect } from 'react';
import {format} from 'timeago.js';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {
  const { currentUser } = useContext(AuthContext);
  const {data}=useContext(ChatContext);
  const scrollRef=useRef();

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"});
  },[message]);

  return (
    <div ref={scrollRef}>
      <div className={currentUser.uid===message.sender?'message owner':'message'}>

          <div className='messageInfo'>
            <img src={currentUser.uid===message.sender?currentUser.photoURL:data.user.profilePic} alt=""/>
            <span>{format(message.createdAt)}</span>
          </div>

          <div className='messageContent'>
            {message.img!=""?<img src={message.img} alt=""/>:null}
            {message.text!=""?<p>{message.text}</p>:null}
          </div>

      </div>
    </div>
  )
}

export default Message

