import "./ResultElection.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { candidates } from "../data/data";
import { Election } from "../types";
import CandidateRating from "./CandidateRating";

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
      </header>
      <ul className="result__list">
        {electionCandidates.map((candidate) => (
          <CandidateRating
            key={candidate.id}
            {...candidate}
            totalVotes={totalVotes}
          />
        ))}
      </ul>
      <Link to={`/election/${id}/candidates`} className="btn primary full">
        Enter Election
      </Link>
    </article>
  );
};

export default ResultElection;
