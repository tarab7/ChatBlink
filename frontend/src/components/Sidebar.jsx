import React from 'react'
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = ({socket}) => {
  return (
    <div className='sidebar'>
      <Navbar socket={socket}/>
      <Search/>
      <Chats socket={socket}/>
    </div>
  )
}

export default Sidebar
