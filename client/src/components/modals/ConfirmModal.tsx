import "./ConfirmModal.css";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";
import { UiActions } from "../../store/ui-slice";

const ConfirmVote = () => {
  const dispatch = useDispatch();

  // ✅  Get modal state from Redux
  const isOpen = useSelector((state: RootState) => state.ui.openConfirmModal);
  const heading = useSelector(
    (state: RootState) => state.ui.confirmModalHeading,
  );
  const onConfirm = useSelector(
    (state: RootState) => state.ui.confirmModalCallback,
  );
  // ✅ Close the confirm modal dialog
  const closeCandidateModal = () => {
    dispatch(UiActions.closeConfirmModalDialog());
  };

  // If modal is closed, return null (no render)
  if (!isOpen) return null;

  return (
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        <h5>{heading}</h5>

        <div className="confirm__vote-cta">
          <button className="btn danger" onClick={closeCandidateModal}>
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={() => {
              if (onConfirm) onConfirm();
              closeCandidateModal();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;
