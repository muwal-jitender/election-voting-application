import "./ElectionCandidate.css";

import ApiErrorMessage from "components/ui/ApiErrorMessage";
import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { useDispatch } from "react-redux";
import { candidateService } from "services/candidate.service";
import { UiActions } from "store/ui-slice";
import { ICandidateModel } from "types";
import { IErrorResponse } from "types/ResponseModel";
import { getOptimizedImageUrl } from "utils/cloudinary.utils";

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
          }
        },
      }),
    );
  };

  const width = 248;
  const height = 224;
  const mobileWidth = 272;

  return (
    <>
      <ApiErrorMessage errors={errors} />
      {/* 👤 Candidate Card */}
      <li className="election-candidate">
        {/* 🖼️ Candidate Image */}
        <div className="election-candidate__image">
          {/* <img src={image} alt={fullName} /> */}

          <img
            src={getOptimizedImageUrl(image, height, width, "fill")}
            alt={fullName}
            srcSet={`
                    ${getOptimizedImageUrl(image, height, width, "fill")} ${width}w,
                    ${getOptimizedImageUrl(image, height, mobileWidth, "fill")} ${mobileWidth}w
                    `}
            sizes={`(max-width: 600px) ${mobileWidth}px, ${width}px`}
          />
        </div>

        {/* 📋 Candidate Info and Delete Action */}
        <div>
          <h3>{fullName}</h3>

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
    </>
  );
};

export default ElectionCandidate;
