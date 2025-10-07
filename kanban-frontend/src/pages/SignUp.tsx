import React,{ useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/auth/AuthForm";


const SignUp = () => {
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async ({ email, password, name, passwordConfirmation }: {
    email: string;
    password: string;
    name: string;
    passwordConfirmation: string;
  }) => {
    try {
      await signUp(email, password, name, passwordConfirmation);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return <AuthForm type="signup" onSubmit={handleSubmit} error={error} />;
}

export default SignUp
