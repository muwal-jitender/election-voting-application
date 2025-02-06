import CandidateRating from "./CandidateRating";
import { Election } from "../types";
import { candidates } from "../data/data";
import { useState } from "react";

const ResultElection = ({ id, thumbnail, title }: Election) => {
  const [totalVotes, setTotalVotes] = useState(258);
  const electionCandidates = candidates.filter(
    (candidate) => candidate.electionId === id,
  );
  return (
    <article className="result">
      <header className="result__header">
        <h4>{title}</h4>
        {/* <p className="result__date">Date: 2021-01-01</p> */}
        <div className="result_header-image">
          <img src={thumbnail} alt={title} />
        </div>
        <ul className="result__list">
          {electionCandidates.map((candidate) => (
            <CandidateRating
              key={candidate.id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
        </ul>
      </header>
    </article>
  );
};

export default ResultElection;
