import "./ElectionCandidate.css";

import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { useDispatch } from "react-redux";
import { candidateService } from "services/candidate.service";
import { UiActions } from "store/ui-slice";
import { ICandidateModel } from "types";
import { IErrorResponse } from "types/ResponseModel";

const ElectionCandidate = ({
  fullName,
  image,
  motto,
  id,
  onCandidateDeleted,
}: ICandidateModel & { onCandidateDeleted: (id: string) => void }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // 🗑️ Handle deletion of a candidate with confirmation dialog and error capture
  const handleDeleteCandidate = (candidateId: string) => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Are you sure?",
        callback: async () => {
          try {
            await candidateService.remove(candidateId);
            onCandidateDeleted(candidateId); // Notify parent on successful deletion
          } catch (error: unknown) {
            setErrors((error as IErrorResponse).errorMessages || []);
            console.log(errors); // Debug log for error details
          }
        },
      }),
    );
  };

  return (
    // 👤 Candidate Card
    <li className="election-candidate">
      {/* 🖼️ Candidate Image */}
      <div className="election-candidate__image">
        <img src={image} alt={fullName} />
      </div>

      {/* 📋 Candidate Info and Delete Action */}
      <div>
        <h5>{fullName}</h5>

        {/* 🗯️ Truncated motto if too long */}
        <small>
          {motto.length > 70 ? motto.substring(0, 70) + "..." : motto}
        </small>

        {/* ❌ Delete Button with Trash Icon */}
        <button className="election-candidate__btn" title="Delete candidate">
          <IoMdTrash onClick={() => handleDeleteCandidate(id)} />
        </button>
      </div>
    </li>
  );
};

export default ElectionCandidate;
