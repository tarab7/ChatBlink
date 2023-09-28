import React from 'react';
import Message from './Message';

const ChatMessages = ({messages}) => {
  return (
    <div className='messages'>
    {
      messages.map((item, i)=>(
          <Message key={i} message={item}/>
      ))
    }
    </div>
  )
}

export default ChatMessages
