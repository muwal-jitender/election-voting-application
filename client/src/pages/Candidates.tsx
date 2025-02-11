import "./Candidates.css";

import { CandidateModel, RootState } from "../types";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import { candidates as dummyCandidates } from "../data/data";

const Candidates = () => {
  const { id } = useParams<{ id: string }>();
  const voteCandidateModalShowing = useSelector(
    (state: RootState) => state.ui.voteCandidateModalShowing,
  );
  // Get Candidates that belongs to this election
  const electionCandidates: CandidateModel[] = dummyCandidates.filter(
    (candidate) => candidate.electionId === id,
  );

  return (
    <>
      <section className="candidates">
        <header className="candidates__header">
          <h1>Vote your candidate</h1>
          <p>
            Below are the candidates for this election. Please cast your vote
            carefully, as you will not be able to participate in this election
            again after submitting your vote.
          </p>
        </header>
        <div className="container candidates__container">
          {electionCandidates.map((candidate) => (
            <Candidate key={candidate.id} {...candidate} />
          ))}
        </div>
      </section>
      {voteCandidateModalShowing && <ConfirmVote />}
    </>
  );
};

export default Candidates;
