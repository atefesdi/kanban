import React, { useState } from "react";
import styles from "./authForm.module.css";

type SignInData = { email: string; password: string };
type SignUpData = { email: string; password: string; name: string; passwordConfirmation: string };

interface AuthFormProps {
  type: "signin";
  onSubmit: (data: SignInData) => Promise<void>;
  error?: string;
}

interface AuthFormSignUpProps {
  type: "signup";
  onSubmit: (data: SignUpData) => Promise<void>;
  error?: string;
}
type Props = AuthFormProps | AuthFormSignUpProps;

const AuthForm: React.FC<Props> = ({ type, onSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const isSignUp = type === "signup";


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      // Type assertion ensures name & passwordConfirmation are present
      onSubmit({ email, password, name, passwordConfirmation } as SignUpData);
    } else {
      onSubmit({ email, password } as SignInData);
    }
  };


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className={styles.subtitle}>
          {isSignUp ? "Sign up to get started" : "Sign in to continue"}
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {isSignUp && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {isSignUp && (
          <div className={styles.field}>
            <label htmlFor="passwordConfirmation" className={styles.label}>Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Re-enter your password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        )}

        <button type="submit" className={styles.button}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <p className={styles.switchText}>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a href="/signin" className={styles.link}>
                Sign in
              </a>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <a href="/signup" className={styles.link}>
                Sign up
              </a>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
