import "./Results.css";

import React from "react";
import ResultElection from "../components/ResultElection";
import { elections as dummyElections } from "../data/data";
import { Election } from "../types";

const Results = () => {
  const [elections, setElections] = React.useState<Election[]>(dummyElections);
  return (
    <section className="results">
      <div className="container results__container">
        {elections.map((election) => (
          <ResultElection key={election.id} {...election} />
        ))}
      </div>
    </section>
  );
};

export default Results;
