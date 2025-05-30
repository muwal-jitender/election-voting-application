// Import the component-specific CSS styles

import "./OTPInput.css";

import React, { useRef, useState } from "react";

// Define the props interface
interface OTPInputProps {
  length?: number; // Number of OTP digits (default is 6)
  onChangeCallback: (value: string) => void; // Callback to send OTP value to parent

  hasError: boolean; // ✅ Add this prop
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6, // Default to 6-digit OTP if not provided
  onChangeCallback,
  hasError, // Default to no error
}) => {
  // State to store individual digits of OTP
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  // Ref to manage focus on input elements
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Handle input change for each OTP digit box
  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Store only the last typed character
    setOtp(newOtp);

    // Notify parent of the updated OTP value
    onChangeCallback(newOtp.join(""));

    // Auto-focus to next input box if current box is filled
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle key events for special behaviors (like Backspace)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      // If current input is empty, move focus to previous input
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="otp-input-group">
      {otp.map((digit, index) => (
        <input
          key={index}
          // 'element' is the actual HTMLInputElement (e.g., <input type="text" />) created by the browser.
          // React calls this function and passes the element once the input is mounted into the DOM.
          // We store the reference in inputsRef so we can programmatically control focus later.
          ref={(element) => {
            inputsRef.current[index] = element!;
          }}
          type="text"
          inputMode="numeric" // Shows numeric keypad on mobile devices
          maxLength={1} // Restrict to only 1 digit per input box
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)} // Update digit on change
          onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace navigation
          className={`otp-box ${hasError && !digit ? "otp-error" : ""}`} // Add error class if hasError
        />
      ))}
    </div>
  );
};

export default OTPInput;
