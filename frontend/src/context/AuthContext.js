import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import {auth} from "../firebase";

export const AuthContext=createContext();
export const AuthContextProvider=({children})=>{
    const [currentUser, setCurrentUser]=useState({});
    useEffect(()=>{
        const unsub=auth.onAuthStateChanged((user)=>{
            setCurrentUser(user);
        });

        return ()=>{
            unsub();
        }

    }, []);

    return(<AuthContext.Provider value={{currentUser}}>
        {children}
    </AuthContext.Provider>)
}