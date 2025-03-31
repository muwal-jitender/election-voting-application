import "./Candidates.css";

import { useCallback, useEffect, useState } from "react";

import Candidate from "components/candidate/Candidate";
import ConfirmModal from "components/modals/ConfirmModal";
import { useParams } from "react-router-dom";
import { electionService } from "services/election.service";
import { ICandidateModel } from "types";

const Candidates = () => {
  // Election Id
  const { id } = useParams<{ id: string }>();

  // Candidates and Voting State
  const [electionCandidates, setElectionCandidates] = useState<
    ICandidateModel[]
  >([]);
  const [voted, setVoted] = useState(false);

  // Fetch Election Candidates
  const getElections = useCallback(async (id: string) => {
    try {
      const result = await electionService.getCandidatesByElectionId(id);
      setElectionCandidates(result.data as ICandidateModel[]);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }, []);

  // Check if Voter has Already Voted
  const checkIfVoted = useCallback(async (id: string) => {
    try {
      const result = await electionService.checkIfVoterAlreadyVoted(id);
      result.data && setVoted(result.data.voted);
    } catch (error) {
      console.error("Error checking voter status:", error);
    }
  }, []);

  // Fetch Data on Component Mount
  useEffect(() => {
    if (id) {
      checkIfVoted(id);
      if (!voted) {
        getElections(id);
      }
    }
  }, [getElections, checkIfVoted, voted, id]);

  // ✅ Extracted JSX Logic for Readability
  const renderHeaderMessage = () => {
    if (voted)
      return (
        <>
          <h1 className="primary">Already Voted</h1>
          <p className="primary">
            You have already voted. Each voter is allowed to cast only one vote.
          </p>
        </>
      );
    if (electionCandidates.length > 0)
      return (
        <>
          <h1>Vote for Your Candidate</h1>
          <p>
            Below are the candidates for this election. Please cast your vote
            carefully, as you will not be able to participate in this election
            again after submitting your vote.
          </p>
        </>
      );
    return (
      <>
        <h1 className="primary">Inactive Election</h1>
        <p className="primary">
          Currently, no candidates have been nominated for this election.
        </p>
      </>
    );
  };

  return (
    <>
      <section className="candidates">
        <header className="candidates__header">{renderHeaderMessage()}</header>

        {!voted && electionCandidates.length > 0 && (
          <div className="container candidates__container">
            {electionCandidates.map((candidate) => (
              <Candidate key={candidate.id} {...candidate} />
            ))}
          </div>
        )}
      </section>

      <ConfirmModal />
    </>
  );
};

export default Candidates;
