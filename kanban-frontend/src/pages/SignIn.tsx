// src/pages/SignIn.tsx
import { useState } from "react";
import styles from "./signin.module.css"
import { signInUser } from "../api/auth";
import { useNavigate } from "react-router-dom";



export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try{
     const data = await signInUser(email, password)

     if (data.user.id) {
      navigate("/")
     }
    } catch(err : unknown){
      if (err instanceof Error) {
        setError(`login error: ${err.message}`);
      } else {
        setError("login error: unknown");
      }
    }
  };

 return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card_style}>
        <h2 className={styles.title}>Sign In</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
}
