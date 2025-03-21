import "./CandidateRating.css";

import { calculateVoteCount } from "utils/utils";

interface CandidateRatingProps {
  fullName: string;
  image: string;
  voteCount: number;
  totalVotes: number;
}
const CandidateRating = ({
  fullName,
  image,
  voteCount,
  totalVotes,
}: CandidateRatingProps) => {
  return (
    <li className="result__Candidate">
      <div className="result__candidate-image">
        <img src={image} alt={fullName} />
      </div>
      <div className="result__candidate-info">
        <div>
          <h5>{fullName}</h5>
          <small>{`${voteCount ?? 0} ${voteCount === 1 ? "vote" : "votes"}`}</small>
        </div>

        <div className="result__candidate-rating">
          <div className="result__candidate-rating-loader">
            <span
              style={{
                width: `${voteCount > 0 ? calculateVoteCount(voteCount, totalVotes) : 0}%`,
              }}
            ></span>
          </div>
          <small>{`${voteCount > 0 ? calculateVoteCount(voteCount, totalVotes).toFixed(2).replace(".00", "") : 0}%`}</small>
        </div>
      </div>
    </li>
  );
};

export default CandidateRating;
