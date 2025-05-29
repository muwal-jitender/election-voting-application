import "./OnLoginVerify2FAModal.css"; // 🎨 Component-specific styles

import React, { useState } from "react";
import { I2FAVerifyModel, IErrorResponse } from "types";

import TwoFAVerificationForm from "components/ui/Verify2FAForm";
import { useUser } from "context/UserContext";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { voterService } from "services/voter.service";
import { UiActions } from "store/ui-slice";

interface IOnLoginVerify2FAModal {
  token: string;
}
const OnLoginVerify2FAModal: React.FC<IOnLoginVerify2FAModal> = ({ token }) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const { setUser } = useUser(); // 🔗 Access user context
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🚀 Navigate after login
  // ✅ Submit 2FA verification code to backend
  const onSubmit = async (formData: I2FAVerifyModel) => {
    try {
      const model = {
        token,
        otp: formData.code,
      };
      const result = await voterService.twoFAlogin(model);
      const user = result.data;

      if (user) {
        setUser(user); // ✅ Set user in context
        if (user.isAdmin) {
          toast.success("You've been logged in as Admin");
        }
        close2FAModal();
        navigate("/results"); // ➡️ Redirect to results page
      }
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
    dispatch(UiActions.close2FALoginModal());
  };

  return (
    <section className="modal">
      <div className="modal__content min-height">
        {/* 🧭 Modal Header */}
        <header className="modal__header">
          <h2>Secure Signin with 2FA</h2>
          <button className="modal__close" onClick={close2FAModal}>
            <IoMdClose />
          </button>
        </header>

        <div className="modal__body">
          {/*  Enter the 6-digit verification code */}
          <TwoFAVerificationForm
            onSubmit={onSubmit}
            serverErrors={serverErrors}
            btnText="Verify & Login"
          />
        </div>
      </div>
    </section>
  );
};

export default OnLoginVerify2FAModal;
