import React, { useContext } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import {auth} from "../firebase";
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const {currentUser}=useContext(AuthContext);
  return currentUser? <Outlet/>: <Navigate to="/login"/>
}

export default ProtectedRoute
