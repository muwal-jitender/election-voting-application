import "./Verify2FAForm.css";

import { ApiErrorMessage, Button, OTPInput } from "components/ui";
import React, { useEffect, useRef } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { I2FAVerifyModel } from "types";
import { twoFaValidationSchema } from "validations/schemas/voter.validation";

interface ITwoFAVerificationFormProps {
  /** Callback when the form is submitted with a valid code. */
  onSubmit: (formData: I2FAVerifyModel) => Promise<void>;
  /** Server-side errors to display. */
  serverErrors: string[];
  /** Optional initial value for the secret (for setup). */
  btnText: string;
  initialSecret?: string | null;
}

const TwoFAVerificationForm: React.FC<ITwoFAVerificationFormProps> = ({
  onSubmit,
  serverErrors,
  btnText,
  initialSecret,
}) => {
  // ✅ Setup form handling and validation with react-hook-form + Yup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<I2FAVerifyModel>({
    resolver: yupResolver(twoFaValidationSchema),
  });

  useEffect(() => {
    register("code", { required: "Code is required" });
  }, [register]);

  // 🧠 Store input ref for autofocus after QR loads
  const inputRef = useRef<HTMLInputElement>(null);

  // 🧷 If an initial secret is provided (e.g., during 2FA setup), set it in the form.
  useEffect(() => {
    if (initialSecret) setValue("secret", initialSecret);
    // Clear secret if not provided (important for login scenario)
    else setValue("secret", "temp secret");
  }, [initialSecret, setValue]);

  // 🎯 Auto-focus on input after QR loads
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div>
      {/* Step 2: Enter the 6-digit verification code */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="setup-2fa">
        <h3>🔢 Enter Code from Your App</h3>

        <label htmlFor="code">
          Type the 6-digit code currently shown in your authenticator app:
        </label>
        <div className="verify-group">
          <OTPInput
            length={6}
            onChangeCallback={(value) => setValue("code", value)}
          />
          {errors.code && (
            <p className="form__client-error-message" role="alert">
              * {String(errors.code.message)}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            assistiveText={btnText}
            align="center"
          >
            {btnText}
          </Button>
        </div>
      </form>

      {/* 🛑 Show any global API errors */}
      <ApiErrorMessage errors={serverErrors} />
    </div>
  );
};

export default TwoFAVerificationForm;
