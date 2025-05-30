import "./Enable2FAModal.css"; // 🎨 Component-specific styles

import { useEffect, useRef, useState } from "react";
import { I2FAVerifyModel, IErrorResponse } from "types";

import { Button } from "components/ui";
import TwoFAVerificationForm from "components/ui/Verify2FAForm";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { voterService } from "services/voter.service";
import { UiActions } from "store/ui-slice";

const Enable2FAModal = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

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

  // 🧠 Store input ref for autofocus after QR loads
  const inputRef = useRef<HTMLInputElement>(null);

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
      const err = error as IErrorResponse;
      if (err.status === 401) {
        setServerErrors(
          err.message ? [err.message] : ["Invalid code. Please try again."],
        );
      } else {
        setServerErrors((error as IErrorResponse).errorMessages || []);
      }
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
          <h2>Secure Your Account with 2FA</h2>
          <button className="modal__close" onClick={close2FAModal}>
            <IoMdClose />
          </button>
        </header>

        {/* 📦 If QR is loaded, show full setup UI */}
        {qrCode ? (
          <div>
            {/* Step 1: Display QR code and backup key */}
            <div className="setup-2fa">
              <h3>🔐 Set Up Two-Factor Authentication</h3>
              <p className="setup-2fa__open-auth-app">
                Open your Authenticator app and scan this code:
              </p>
              <img src={qrCode} alt="QR Code" className="qr-image" />
              <p className="backup">Can't scan? Enter this key manually:</p>
              <p className="secret-key">
                <strong>
                  {secret ? secret.match(/.{1,4}/g)?.join(" ") : "Loading..."}
                </strong>
              </p>
              <Button
                onClick={() => {
                  if (secret) {
                    navigator.clipboard.writeText(secret);
                    toast.success("🔐 Secret key copied to clipboard!");
                  }
                }}
                variant="primary"
                type="button"
                size="sm"
                assistiveText="Copy the backup key to clipboard"
                align="center"
              >
                📋 Copy Key
              </Button>
            </div>

            <div className="divider">
              <hr />
            </div>

            {/* Step 2: Enter the 6-digit verification code */}
            <TwoFAVerificationForm
              onSubmit={onSubmit}
              serverErrors={serverErrors}
              btnText="Verify & Enable 2FA"
              initialSecret={secret}
            />
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
