import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"; // ✅ Button styles
  size?: "sm" | "lg"; // ✅ Small & Large button support
  isLoading?: boolean; // ✅ Show loading text
  align?: "left" | "center" | "right"; // ✅ New alignment prop
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size,
  isLoading = false,
  align = "right",
  type = "button",
  ...props
}) => {
  return (
    <div className={`btn-container btn-${align}`}>
      <button
        className={`btn ${variant} ${size ? size : ""}`}
        type={type}
        {...props}
      >
        {isLoading ? "Processing..." : children}
      </button>
    </div>
  );
};

export default Button;
