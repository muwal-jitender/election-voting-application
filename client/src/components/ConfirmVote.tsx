import "./ConfirmVote.css";

import { useEffect, useState } from "react";

import { candidates } from "../data/data";
import { CandidateModel } from "../types";

const ConfirmVote = () => {
  const [modalCandidate, setModalCandidate] = useState<CandidateModel | null>(
    null,
  );

  const fetchCandidate = () => {
    const candidate = candidates.find((candidate) => candidate.id === "c1");
    if (candidate) {
      setModalCandidate(candidate);
    }
  };
  useEffect(() => {
    fetchCandidate();
  }, []);

  return (
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        <h5>Please confirm your vote</h5>
        {modalCandidate && (
          <>
            <div className="confirm__vote-image">
              <img src={modalCandidate.image} alt={modalCandidate.fullName} />
            </div>
            <h2>{modalCandidate.fullName}</h2>
            <p>
              {modalCandidate.motto.length > 45
                ? modalCandidate.motto.substring(0, 45) + "..."
                : modalCandidate.motto}
            </p>
          </>
        )}
        <div className="confirm__vote-cta">
          <button className="btn danger">Cancel</button>
          <button className="btn primary">Confirm</button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;
