import React, { type JSX } from 'react'
import { Navigate } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext"

interface ProtectedRouteType{
  children: JSX.Element;
}

const ProtectedRoute = ({children}: ProtectedRouteType) => {

   const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute
