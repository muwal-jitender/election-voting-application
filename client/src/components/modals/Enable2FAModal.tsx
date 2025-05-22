import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { voterService } from "services/voter.service";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types";

const Enable2FAModal = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const dispatch = useDispatch();

  const start2FASetup = async () => {
    try {
      const res = await voterService.setup();
      console.log(JSON.stringify(res));

      setQrCode(res.data?.qrCodeImage || null);
      setSecret(res.data?.secret || null);
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []); // Handle server errors
    }
  };

  // ❌ Close modal
  const close2FAModal = () => {
    dispatch(UiActions.close2FAAuthenticationModal());
  };
  return (
    <section className="modal">
      <div className="modal__content">
        {/* 🧭 Modal Header */}
        <header className="modal__header">
          <h2>Enable Two-Factor Authentication (2FA)</h2>
          <button className="modal__close" onClick={close2FAModal}>
            <IoMdClose />
          </button>
        </header>
        {qrCode ? (
          <>
            <p>Scan this QR code with your Authenticator app:</p>
            <img
              src={qrCode}
              alt="QR Code"
              className="qr-image"
              height="100px"
              width="100px"
            />
            <p className="backup">
              Backup code: <strong>{secret}</strong>
            </p>
          </>
        ) : (
          <button className="btn-primary" onClick={start2FASetup}>
            🔐 Start 2FA Setup
          </button>
        )}
      </div>
    </section>
  );
};

export default Enable2FAModal;
