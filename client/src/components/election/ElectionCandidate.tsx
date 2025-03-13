import "./ElectionCandidate.css";

import { useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { removeCandidate } from "../../services/candidate.service";
import { ICandidateModel } from "../../types";
import { IErrorResponse } from "../../types/ResponseModel";

const ElectionCandidate = ({ fullName, image, motto, id }: ICandidateModel) => {
  const [errors, setErrors] = useState<string[]>([]); // Empty array

  const handleDelete = async () => {
    try {
      await removeCandidate(id);
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
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
        <button className="election-candidate__btn">
          <IoMdTrash onClick={handleDelete} />
        </button>
      </div>
    </li>
  );
};

export default ElectionCandidate;
