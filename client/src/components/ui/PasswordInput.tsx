import "./PasswordInput.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { IInputProps } from "types/InputTypes";

const PasswordInput = <T extends FieldValues>({
  id,
  register,
  error,
  placeholder,
}: IInputProps<T>) => {
  // 🔁 Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      {/* 🧩 Password input and toggle icon wrapper */}
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"} // 👁️ Toggle input type
          id={id}
          {...register(id)} // 🔗 Connect to react-hook-form
          className={`password-input ${error ? "input-error" : ""}`}
          placeholder={`Enter ${placeholder}`}
        />

        {/* 👁️ Toggle password visibility button */}
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash className="eye-icon" />
          ) : (
            <FaEye className="eye-icon" />
          )}
        </button>
      </div>

      {/* ⚠️ Show error message if validation fails */}
      {error && (
        <p className="form__client-error-message">* {String(error.message)}</p>
      )}
    </div>
  );
};

export default PasswordInput;
