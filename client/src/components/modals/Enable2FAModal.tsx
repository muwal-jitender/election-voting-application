import "./Enable2FAModal.css"; // 🎨 Component-specific styles

import { Button, TextInput } from "components/ui";
import { useEffect, useRef, useState } from "react";
import { I2FAVerifyModel, IErrorResponse } from "types";

import { yupResolver } from "@hookform/resolvers/yup";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { voterService } from "services/voter.service";
import { UiActions } from "store/ui-slice";
import { twoFaValidationSchema } from "validations/schemas/voter.validation";

const Enable2FAModal = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "verifying"
  >("idle");

  const dispatch = useDispatch();

  // 🔐 Call backend to generate QR + secret for TOTP setup
  const start2FASetup = async () => {
    try {
      const res = await voterService.setup();
      setQrCode(res.data?.qrCodeImage || null);
      setSecret(res.data?.secret || null);
    } catch (error: unknown) {
      // 🛑 Catch and display setup errors
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  // ✅ Setup form handling and validation with react-hook-form + Yup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<I2FAVerifyModel>({
    resolver: yupResolver(twoFaValidationSchema),
  });

  // 🧠 Store input ref for autofocus after QR loads
  const inputRef = useRef<HTMLInputElement>(null);

  // 🧷 Set secret in the form when it becomes available
  useEffect(() => {
    if (secret) setValue("secret", secret);
  }, [secret, setValue]);

  // 🎯 Auto-focus on input after QR loads
  useEffect(() => {
    if (qrCode && inputRef.current) inputRef.current.focus();
  }, [qrCode]);

  // ✅ Submit 2FA verification code to backend
  const onSubmit = async (formData: I2FAVerifyModel) => {
    try {
      await voterService.verify(formData);
      toast.success(
        "Two-Factor Authentication Enabled. You will be asked for a code every time you login.",
      );
      close2FAModal();
    } catch (error: unknown) {
      setStatus("error");
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  // ❌ Close modal and reset any open state
  const close2FAModal = () => {
    dispatch(UiActions.close2FAAuthenticationModal());
  };

  return (
    <section className="modal">
      <div className="modal__content">
        {/* 🧭 Modal Header */}
        <header className="modal__header">
          <h2>Two-Factor Authentication (2FA)</h2>
          <button className="modal__close" onClick={close2FAModal}>
            <IoMdClose />
          </button>
        </header>

        {/* 🛑 Show any global API errors */}
        <ApiErrorMessage errors={serverErrors} />

        {/* 📦 If QR is loaded, show full setup UI */}
        {qrCode ? (
          <div>
            {/* Step 1: Display QR code and backup key */}
            <div className="setup-2fa">
              <h3>Step 1 - Enable Two-Factor Authentication</h3>
              <p>Open your Authenticator app and scan this QR code:</p>
              <img src={qrCode} alt="QR Code" className="qr-image" />
              <p className="backup">Or Enter Manually:</p>
              <p>
                <strong>{secret}</strong>
              </p>
            </div>

            <div className="divider">
              <hr />
            </div>

            {/* Step 2: Enter the 6-digit verification code */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="setup-2fa"
            >
              <h3>Step 2 - Enter 6-Digit Code</h3>

              <label htmlFor="code">
                Enter 6-digit code shown on Authenticator app:
              </label>
              <TextInput
                error={errors.code}
                id="code"
                placeholder="code"
                register={register}
                type="tel"
                inputMode="numeric"
                autoFocus={true}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                assistiveText="Verify & Activate 2FA"
              >
                Verify & Activate
              </Button>
            </form>

            {/* ❌ Soft error on form failure */}
            {status === "error" && (
              <p className="form__error-message" role="alert">
                Two-Factor authentication setup failed, please try again.
              </p>
            )}
          </div>
        ) : (
          // 🔘 Initial button to begin 2FA setup
          <div className="setup-start">
            <Button variant="primary" type="button" onClick={start2FASetup}>
              🔐 Start 2FA Setup
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Enable2FAModal;
