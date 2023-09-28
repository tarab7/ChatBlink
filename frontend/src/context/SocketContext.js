// import React, { createContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// export const SocketContext=createContext();
// export const SocketContextProvider=({children})=>{
//     const [socket, setSocket]=useState(null);

//     useEffect(()=>{
//         const skt=()=>{
//             setSocket(io("ws://localhost:8900"));
//             //console.log(socket);
//         }

//         return ()=>{
//             skt();
//         }

//     }, []);

//     return(<SocketContext.Provider value={{socket}}>
//         {children}
//     </SocketContext.Provider>)
// }