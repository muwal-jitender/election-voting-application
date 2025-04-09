import "./ConfirmModal.css";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store/store";
import { UiActions } from "store/ui-slice";

const ConfirmModal = () => {
  const dispatch = useDispatch();

  // ✅ Retrieve modal state and data from Redux store
  const isOpen = useSelector((state: RootState) => state.ui.openConfirmModal);
  const heading = useSelector(
    (state: RootState) => state.ui.confirmModalHeading,
  );
  const onConfirm = useSelector(
    (state: RootState) => state.ui.confirmModalCallback,
  );

  // ❌ Close the modal
  const closeCandidateModal = () => {
    dispatch(UiActions.closeConfirmModalDialog());
  };

  // 🚫 Don't render modal if it's closed
  if (!isOpen) return null;

  return (
    // 🧩 Modal Wrapper
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        {/* 🧭 Modal Heading */}
        <h2>{heading}</h2>

        {/* 🟢 Confirm / 🔴 Cancel Buttons */}
        <div className="confirm__vote-cta">
          {/* Cancel Button */}
          <button className="btn danger" onClick={closeCandidateModal}>
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            className="btn primary"
            onClick={() => {
              if (onConfirm) onConfirm(); // Call the confirm callback if available
              closeCandidateModal(); // Then close the modal
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmModal;
