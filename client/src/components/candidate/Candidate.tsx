import "./Candidate.css";

import { useDispatch } from "react-redux";
import { UiActions } from "../../store/ui-slice";
import { voteActions } from "../../store/vote-slice";
import { ICandidateModel } from "../../types";

const Candidate = ({ image, id, fullName, motto }: ICandidateModel) => {
  const dispatch = useDispatch(); // Hook to send actions to Redux

  // Open the confirm vote modal
  const handleCastingVote = () => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Please confirm your vote",
        callback: () => {
          alert("Your vote casted");
        },
      }),
    );
    dispatch(voteActions.changeSelectedVoteCandidate(id));
  };

  return (
    <article className="candidate">
      <div className="candidate__image">
        <img src={image} alt={fullName} />
      </div>
      <h5>
        {fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}
      </h5>
      <small>
        {motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}
      </small>
      <button className="btn primary" onClick={handleCastingVote}>
        Vote
      </button>
    </article>
  );
};

export default Candidate;
