import "./ElectionCandidate.css";

import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { useDispatch } from "react-redux";
import { removeCandidate } from "../../services/candidate.service";
import { UiActions } from "../../store/ui-slice";
import { ICandidateModel } from "../../types";
import { IErrorResponse } from "../../types/ResponseModel";

const ElectionCandidate = ({
  fullName,
  image,
  motto,
  id,
  onCandidateDeleted,
}: ICandidateModel & { onCandidateDeleted: (id: string) => void }) => {
  const [errors, setErrors] = useState<string[]>([]); // Empty array
  const dispatch = useDispatch();

  /** Handle candidate deletion ✅ */
  const handleDeleteCandidate = (candidateId: string) => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Are you sure?",
        callback: async () => {
          try {
            await removeCandidate(candidateId);
            onCandidateDeleted(candidateId);
          } catch (error: unknown) {
            setErrors((error as IErrorResponse).errorMessages || []);
          }
        },
      }),
    );
  };

  return (
    <li className="election-candidate">
      <div className="election-candidate__image">
        <img src={image} alt={fullName} />
      </div>
      <div>
        <h5>{fullName}</h5>
        <small>
          {motto.length > 70 ? motto.substring(0, 70) + "..." : motto}
        </small>
        <button className="election-candidate__btn" title="Delete candidate">
          <IoMdTrash onClick={() => handleDeleteCandidate(id)} />
        </button>
      </div>
    </li>
  );
};

export default ElectionCandidate;
