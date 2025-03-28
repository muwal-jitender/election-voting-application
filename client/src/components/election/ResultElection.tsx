import "./ResultElection.css";

import { useEffect, useState } from "react";
import { ICandidateModel, IElectionDetail } from "types";

import CandidateRating from "components/candidate/CandidateRating";
import { Link } from "react-router-dom";

const ResultElection = (electionDetail: IElectionDetail) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] =
    useState<ICandidateModel[]>();

  useEffect(() => {
    setElectionCandidates(electionDetail.candidates);
    const totalVoteCount = electionCandidates?.reduce(
      (acc, candidate) => acc + (candidate.voteCount ?? 0),
      0,
    );
    setTotalVotes(totalVoteCount ?? 0);
  }, [electionDetail.candidates, electionCandidates]); // ✅ Ensures this only runs once per election

  return (
    <article className="result">
      <header className="result__header">
        <h4>{electionDetail.title}</h4>
        {/* <p className="result__date">Date: 2021-01-01</p> */}
        <div className="result_header-image">
          <img src={electionDetail.thumbnail} alt={electionDetail.title} />
        </div>
      </header>
      <ul className="result__list">
        {electionCandidates &&
          electionCandidates.map((candidate) => (
            <CandidateRating
              key={candidate.id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
      </ul>
      <Link
        to={`/elections/${electionDetail.id}/candidates`}
        className="btn primary full"
      >
        Enter Election
      </Link>
    </article>
  );
};

export default ResultElection;
