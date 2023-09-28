import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from "../firebase";
import { AuthContext } from '../context/AuthContext';
import UserChat from './UserChat';
import incoming from '../sounds/incoming.mp3';
import outgoing from '../sounds/outgoing.mp3';

const Chats = ({socket}) => {
  const [conversations, setConversations] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const [inc]=useState(new Audio(incoming));
  const [out]=useState(new Audio(outgoing));

  //--------------SOCKET IO -----------------------------------------------

  const [newConv, setNewConv]=useState(null);
  const [index, setIndex]=useState(-1);
  const [oldConv, setOldConv]=useState(false);  //To rerender again if index change hora hai (It is also possible ki prev index ke same ho new Index of current Chat to usko vapis uper phchane k liye we need to change state constantly every time we find index)

  useEffect(()=>{
    if(newConv){
      if(conversations.filter(c => c._id==newConv._id).length==0){
        setConversations((prev)=>[newConv, ...prev]);
      }
      else{
          conversations.map((conv, ind) => {
          if (conv._id === newConv._id) {
            setIndex(ind);
            setOldConv(!oldConv); //Triggering state to change position of current chat to top
          } 
            return conv;
        })
      }

    }
  },[newConv])


  useEffect(()=>{
    if(index===-1)
      return;
    setConversations((prev)=> [prev[index], ...prev.slice(0, index), ...prev.slice(index+1)]);
  },[oldConv])

  //---------------socket io till here----------------------------------------

  useEffect(() => {


    //--------------UseEffect Socket function----------------------------------
    socket.current && socket.current.on("getMessage",(d)=>{
      //Agr New conversation start kri hai then usko apne sidebar Chats me bi add krna pdega (Here sender is Other person)
      if(inc){
        const promise = inc.play();
        if(promise !== undefined){
            promise.then(() => {
                // Autoplay started
            }).catch(error => {
                // Autoplay was prevented.
            });
        }
      }

        setNewConv({
          _id:d.conversationId,
          members:[currentUser.uid, d.senderId],
          lastText:d.text===""?"@Photo":d.text,
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
    });

  socket.current && socket.current.on("getMyMessage",(d)=>{
    //Agr New conversation start kri hai then usko apne sidebar Chats me bi add krna pdega (Here sender is Me)
    if(out){
      const promise = out.play();
      if(promise !== undefined){
          promise.then(() => {
              // Autoplay started
          }).catch(error => {
              // Autoplay was prevented.
          });
      }
    }
      setNewConv({
        _id:d.conversationId,
        members:[currentUser.uid, d.receiverId],
        lastText:d.text===""?"@Photo":d.text,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    });
    //--------------UseEffect Socket function End-------------------------------

    const getConv = async () => {
      let response = await fetch(`http://localhost:8800/api/conversation/${currentUser.uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      response = await response.json();
      //console.log(response);
      if (response.error) {
        console.log(response.error);
      }
      else {
        setConversations(response.sort(function(a,b){
          return new Date(b.updatedAt)- new Date(a.updatedAt)
        }));
      }
    }
    getConv();
  }, [currentUser.uid]);


  return (
    <div className='chats'>
      {
        conversations && conversations.map((c,i)=>(
          <UserChat key={c._id} userConv={c} currUserId={currentUser.uid} socket={socket}/>
        ))
      }
    </div>
  )
}

export default Chats;
