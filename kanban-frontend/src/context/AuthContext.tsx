/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { loginResponse } from "../types/types";
import { signInUser, signUpUser } from "../api/auth";

interface AuthContextType{
  user: loginResponse["user"] | null;
  jwt: string | null;
  setJwt: (token:string) => void;
  setUser: React.Dispatch<React.SetStateAction<loginResponse["user"] | null>>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name:string, password_confirmation:string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext= createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

  const [jwt, setJwt] = useState<string | null>(localStorage.getItem("jwt"));
  const [user, setUser] = useState<loginResponse["user"] | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

   useEffect(() => {
    const savedToken = localStorage.getItem("jwt");
    if (savedToken) {
      setJwt(savedToken);
      setIsAuthenticated(true);
      setLoading(false);
    }else {
    setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await signInUser(email, password);
    if (data.token) {
      setJwt(data.token);
      setUser(data.user);
      localStorage.setItem("jwt", data.token);
      setIsAuthenticated(true);
    }
    navigate("/");
    return isAuthenticated
  };

  const signUp = async (email: string, password: string, name: string, passwordConfirmation:string) => {
    const data = await signUpUser(email, password, name, passwordConfirmation);
    if (data.token) {
      setJwt(data.token);
      setUser(data.user);
      localStorage.setItem("jwt", data.token);
      setIsAuthenticated(true);
    }
    navigate("/");
    return isAuthenticated
  };


   const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem("jwt");
    navigate("/signin");
  };



  return (
    <AuthContext.Provider value={{ user, jwt, setUser, setJwt, logout, signIn ,loading, isAuthenticated, signUp}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth =()=>{
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
