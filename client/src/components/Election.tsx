import "./Election.css";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UiActions } from "../store/ui-slice";
import { ElectionModel } from "../types";

const Election = ({ id, title, description, thumbnail }: ElectionModel) => {
  const dispatch = useDispatch();
  const openUpdateElectionModal = () => {
    dispatch(UiActions.openUpdateElectionModal());
  };

  return (
    <article className="election">
      <div className="election__image">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="election__info">
        <Link to={`/elections/${id}`}>
          <h4>{title}</h4>
        </Link>
        <p>
          {description.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>
        <div className="election__cta">
          <Link to={`/elections/${id}`} className="btn sm primary">
            View
          </Link>
          <button className="btn sm primary" onClick={openUpdateElectionModal}>
            Edit
          </button>
        </div>
      </div>
    </article>
  );
};

export default Election;
