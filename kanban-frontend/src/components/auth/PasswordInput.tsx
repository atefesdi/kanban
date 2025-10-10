import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./passwordInput.module.css"

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder: string;
  className: string;

};

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, name, id , placeholder, className}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <div className={styles.container}>
        <input
        id={id}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={className}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={styles.seePassword}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={0} />
          ) : (
            <AiOutlineEye size={0} />
          )}
        </button>
      </div>
  );
};

export default PasswordInput;
