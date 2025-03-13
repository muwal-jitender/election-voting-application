import "./Election.css";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UiActions } from "../../store/ui-slice";
import { IElectionModel } from "../../types";

const Election = (election: IElectionModel) => {
  const dispatch = useDispatch();
  const openUpdateElectionModal = () => {
    dispatch(UiActions.openUpdateElectionModal(election));
  };

  return (
    <article className="election">
      <div className="election__image">
        <img src={election.thumbnail} alt={election.title} />
      </div>
      <div className="election__info">
        <Link to={`/elections/${election.id}`}>
          <h4>{election.title}</h4>
        </Link>
        <p>
          {election.description.length > 255
            ? election.description.substring(0, 255) + "..."
            : election.description}
        </p>
        <div className="election__cta">
          <Link to={`/elections/${election.id}`} className="btn sm primary">
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
