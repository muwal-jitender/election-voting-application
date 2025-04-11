import "./ResultElection.css";

import { useEffect, useState } from "react";
import { ICandidateModel, IElectionDetail } from "types";

import CandidateRating from "components/candidate/CandidateRating";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "utils/cloudinary.utils";

const ResultElection = (electionDetail: IElectionDetail) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] =
    useState<ICandidateModel[]>();

  // 🧮 Set candidates and compute total votes for the election
  useEffect(() => {
    setElectionCandidates(electionDetail.candidates);

    const totalVoteCount = electionDetail.candidates?.reduce(
      (acc, candidate) => acc + (candidate.voteCount ?? 0),
      0,
    );

    setTotalVotes(totalVoteCount ?? 0);
  }, [electionDetail.candidates]);

  return (
    // 🧾 Election Result Card
    <article className="result">
      {/* 🏷️ Header with election title and thumbnail */}
      <header className="result__header">
        <h4>{electionDetail.title}</h4>

        {/* 🖼️ Election Thumbnail */}
        <div className="result_header-image">
          <img
            src={getOptimizedImageUrl(electionDetail.thumbnail, 48, 48)}
            alt={electionDetail.title}
          />
        </div>
      </header>

      {/* 🗳️ Candidate Rating List */}
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

      {/* 🚪 Link to view or participate in election */}
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
