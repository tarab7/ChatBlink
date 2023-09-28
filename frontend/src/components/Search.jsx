import React, { useState, useContext, useEffect } from 'react'
import { auth } from "../firebase";
import { ChatContext } from '../context/ChatContext';
import removeImg from "../images/cross.png";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);
  const [err, setErr] = useState(false);
  const [empty, setEmpty] = useState(0);
  const [searching, setSearching]=useState(false);
  const currentUser = auth.currentUser;
  const {dispatch}=useContext(ChatContext);

  const handleSearch = async () => {
    setSearching(true);
    let response = await fetch(`http://localhost:8800/api/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    response = await response.json();
    if (response.error) {
      setErr(true);
    }
    else {
      setUser(response);
    }
  }

  useEffect(()=>{
    if (user.length == 0 && searching==true)
        setEmpty(1);
      else
        setEmpty(0);
  },[user])

  const handleSelect = async (userItem) => {

    const userid=userItem.firebaseId;
    //FIND IF THEIR CONVO ALREADY EXISTS
    let response = await fetch(`http://localhost:8800/api/conversation/${currentUser.uid}/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    response = await response.json();
    if (response.error) {
      setErr(true);
      console.log(response.error);
    }
    if (response.length != 0 && currentUser.uid!=userid)
    {
      dispatch({"type":"CHANGE_USER", payload:userItem, payload2:response[0]._id});
      return;
    }
    if(currentUser.uid===userid){
      return;
    }

      //IF CONVO NOT FOUND MAKE IT
    const conv={"senderId":currentUser.uid, "receiverId":userid}
    let response2 = await fetch(`http://localhost:8800/api/conversation`, {
      method: "POST",
      body:JSON.stringify(conv),
      headers: {
        "Content-Type": "application/json",
      },
    })
    response2 = await response2.json();
    if (response2.error) {
      console.log(response2.error);
    }
    else {
      dispatch({"type":"CHANGE_USER", payload:user[0], payload2:response2._id});
      //user ek array hai search api ke response me that's why we did it here
    }
  }


  return (
    <div className='search'>
      <div className='searchForm'>

        <input type="text" placeholder='Find a user...' value={username} onChange={e => setUsername(e.target.value)} onKeyDown={(e) => e.code === "Enter" ? handleSearch() : null} />

        {username!=="" && <span className='cancelSearch' onClick={()=>{setUser([]); setSearching(false); setUsername("")}}><img src={removeImg} alt=""/></span>}
      </div>

      {
        empty === 1 ?
          <span className='searchNotFound'>No user found</span>
          :
          user.map((userItem, index) => (
            <div className='searchUserChat' key={index} onClick={()=>handleSelect(userItem)}>
              <img src={userItem.profilePic} alt="" />
              <div className='searchChatInfo'>
                <span>{userItem.name}</span>
              </div>
            </div>
          ))
      }

    </div>
  )
}

export default Search
