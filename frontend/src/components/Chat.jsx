import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import Messages from './Messages';
import add from "../images/user.png";
import cam from "../images/zoom.png";
import opt from "../images/menu.png";

const Chat = ({socket}) => {
    
  const {data}=useContext(ChatContext);

  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{data.user?.name}</span>
        {data.conversationId!="null"?<div className='chatIcons'>
          <img src={cam} alt=""/>
          <img src={add} alt=""/>
          <img src={opt} alt=""/>
        </div>:null}
      </div>
      {
        data.conversationId!="null"?
        <>
        <Messages socket={socket}/>
        </>:
        <p className='not_selected'>Open a conversation to start a chat.</p>
      }
      
    </div>
  )
}

export default Chat
