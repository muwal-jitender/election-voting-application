import "./Candidate.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VoteCandidate } from "../../services/candidate.service";
import { UiActions } from "../../store/ui-slice";
import { voteActions } from "../../store/vote-slice";
import { ICandidateModel } from "../../types";
import { IErrorResponse } from "../../types/ResponseModel";

const Candidate = ({ ...props }: ICandidateModel) => {
  const dispatch = useDispatch(); // Hook to send actions to Redux
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  /** ✅ Open the confirm vote modal */
  const handleCastingVote = () => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Please confirm your vote",
        callback: () => {
          try {
            VoteCandidate(props.id, props.electionId);
            navigate("/congrats");
          } catch (error: unknown) {
            setErrors((error as IErrorResponse).errorMessages || []);
          }
        },
      }),
    );
    dispatch(voteActions.changeSelectedVoteCandidate(props.id));
  };

  return (
    <article className="candidate">
      <div className="candidate__image">
        <img src={props.image} alt={props.fullName} />
      </div>
      <h5>
        {props.fullName?.length > 20
          ? props.fullName.substring(0, 20) + "..."
          : props.fullName}
      </h5>
      <small>
        {props.motto?.length > 25
          ? props.motto.substring(0, 25) + "..."
          : props.motto}
      </small>
      <button className="btn primary" onClick={handleCastingVote}>
        Vote
      </button>
    </article>
  );
};

export default Candidate;
