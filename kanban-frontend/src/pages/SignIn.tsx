// src/pages/SignIn.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";




export default function SignIn() {
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return <AuthForm type="signin" onSubmit={handleSubmit} error={error} setError={setError} />;
};
