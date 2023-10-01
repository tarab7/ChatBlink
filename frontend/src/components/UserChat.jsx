import React, { useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useContext } from 'react';
import incoming from '../sounds/incoming.mp3';
import outgoing from '../sounds/outgoing.mp3';
import {BASE_URL} from "../portFile";

const UserChat = (props) => {
    //console.log("---------------Inside User Chat--------------")
    
    const userConv=props.userConv;
    const currUserId=props.currUserId;
    const socket=props.socket;
    

    const {dispatch}=useContext(ChatContext);
    

    const [user, setUser] = useState(null);
    const [lastText, setLastText]=useState(userConv.lastText);
    const [onlineStatus, setOnlineStatus]=useState(false);
    const friendId = userConv.members.find((m) => m !== currUserId);

    const [inc]=useState(new Audio(incoming));
    const [out]=useState(new Audio(outgoing));

    useEffect(() => {

        socket.current && socket.current.on("getMessage",(d)=>{
            if(d.senderId===friendId){
                setLastText(d.text===""?"@Photo":d.text);
            }
          })

        socket.current && socket.current.on("getMyMessage",(d)=>{
            if(d.receiverId===friendId){
                setLastText(d.text===""?"@Photo":d.text);
            }
        })

        socket.current && socket.current.emit("getOnline", friendId);
        socket.current && socket.current.on("onlineStatus", (d)=>{
            if(d.userId===friendId && d.online===true){
                setOnlineStatus(true);
            }
            if(d.userId===friendId && d.online===false){
                setOnlineStatus(false);
            }
        })
            
        const getUser = async () => {
            
            let response = await fetch(`${BASE_URL}/api/user/getUserById/${friendId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            response = await response.json();
            if (response.error) {
                console.log(response.error);
            }
            else {
                //console.log(response);
                setUser(response);
            }
        }

        getUser();

    }, []);

    const handleSelect=()=>{
        dispatch({"type":"CHANGE_USER", payload:user, payload2:userConv._id});
      }

    return (
        <div className='userChat' onClick={()=>handleSelect()}>
        
            {user && 
            <>
            <div className='userChatImg'>
                <img src={user.profilePic} alt="" />
                {onlineStatus && <div className='chatOnlineBadge'></div>}
            </div>
                <div className='userChatInfo'>
                    <span>{user.name}</span>
                    <p>{lastText}</p>
                </div>
            </>}
            
        </div>
    )
}

export default UserChat
