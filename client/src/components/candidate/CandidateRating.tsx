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
    // 🧑‍🤝‍🧑 Candidate Result List Item
    <li className="result__Candidate">
      {/* 🖼️ Candidate Image */}
      <div className="result__candidate-image">
        <img src={image} alt={fullName} />
      </div>

      {/* 📝 Candidate Info and Rating */}
      <div className="result__candidate-info">
        {/* 📛 Name and vote count */}
        <div>
          <h5>{fullName}</h5>
          <small>
            {`${voteCount ?? 0} ${voteCount === 1 ? "vote" : "votes"}`}
          </small>
        </div>

        {/* 📊 Rating Bar */}
        <div className="result__candidate-rating">
          <div className="result__candidate-rating-loader">
            {/* 🔵 Dynamic width based on vote percentage */}
            <span
              style={{
                width: `${voteCount > 0 ? calculateVoteCount(voteCount, totalVotes) : 0}%`,
              }}
            ></span>
          </div>

          {/* 🔢 Show percentage (cleaned up if .00) */}
          <small>
            {`${
              voteCount > 0
                ? calculateVoteCount(voteCount, totalVotes)
                    .toFixed(2)
                    .replace(".00", "")
                : 0
            }%`}
          </small>
        </div>
      </div>
    </li>
  );
};

export default CandidateRating;
