import "./ResultElection.css";

import { useEffect, useState } from "react";
import { ICandidateModel, IElectionModel } from "../../types";

import { Link } from "react-router-dom";
import { getCandidatesByElectionId } from "../../services/election.service";
import CandidateRating from "../candidate/CandidateRating";

const ResultElection = ({ id, thumbnail, title }: IElectionModel) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] =
    useState<ICandidateModel[]>();
  const getElectionCandidates = async (id: string) => {
    try {
      const result = await getCandidatesByElectionId(id);
      const candidates: ICandidateModel[] = Array.isArray(result.data)
        ? result.data
        : [];

      if (!candidates.length) return; // ✅ Exit early if no candidates

      setElectionCandidates(candidates);
      const totalVoteCount = candidates.reduce(
        (acc, candidate) => acc + (candidate.voteCount ?? 0),
        0,
      );
      setTotalVotes(totalVoteCount);
    } catch (error: unknown) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  useEffect(() => {
    getElectionCandidates(id);
  }, [id]); // ✅ Ensures this only runs once per election

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
        {electionCandidates &&
          electionCandidates.map((candidate) => (
            <CandidateRating
              key={candidate.id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
      </ul>
      <Link to={`/elections/${id}/candidates`} className="btn primary full">
        Enter Election
      </Link>
    </article>
  );
};

export default ResultElection;
