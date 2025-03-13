import "./ElectionCandidate.css";

import { IoMdTrash } from "react-icons/io";
import { ICandidateModel } from "../../types";

const ElectionCandidate = ({ fullName, image, motto, id }: ICandidateModel) => {
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
          <IoMdTrash />
        </button>
      </div>
    </li>
  );
};

export default ElectionCandidate;
