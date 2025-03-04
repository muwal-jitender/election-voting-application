import "./ResultElection.css";

import { useCallback, useEffect, useState } from "react";
import { ICandidateModel, IElectionModel } from "../types";

import { Link } from "react-router-dom";
import { getCandidatesByElectionId } from "../services/election.service";
import CandidateRating from "./CandidateRating";

const ResultElection = ({ id, thumbnail, title }: IElectionModel) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] =
    useState<ICandidateModel[]>();
  const getElections = useCallback(async (id: string) => {
    try {
      const result = await getCandidatesByElectionId(id);
      setElectionCandidates(result.data as ICandidateModel[]);
      if (result.data) {
        for (let i = 0; i < result.data.length; i++) {
          const element = result.data[i];
          setTotalVotes((prevState) => (prevState += element.voteCount));
        }
      }
    } catch (error: unknown) {
      console.log(error);
    }
  }, []); // No dependencies -> Won't be recreated on each render

  useEffect(() => {
    getElections(id);
  }, [getElections, id]); // Now safe to include

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
