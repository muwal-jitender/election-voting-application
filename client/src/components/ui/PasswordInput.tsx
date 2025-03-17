import "./PasswordInput.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { IInputProps } from "../../types/InputTypes";

const PasswordInput = <T extends FieldValues>({
  id,
  register,
  error,
  placeholder,
}: IInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          {...register(id)}
          className={`password-input ${error ? "input-error" : ""}`}
          placeholder={`Enter ${placeholder}`}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && (
        <p className="form__client-error-message">{String(error.message)}</p>
      )}
    </div>
  );
};

export default PasswordInput;
