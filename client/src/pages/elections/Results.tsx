import "./Results.css";

import React, { useEffect, useState } from "react";

import ResultElection from "components/election/ResultElection";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import { geElectionResults } from "services/election.service";
import { IElectionDetail } from "types";
import { IErrorResponse } from "types/ResponseModel";

const Results = () => {
  const [elections, setElections] = React.useState<IElectionDetail[]>();
  const [errors, setErrors] = useState<string[]>([]); // Empty array

  useEffect(() => {
    const getElections = async () => {
      try {
        const result = await geElectionResults();
        setElections(result.data as IElectionDetail[]);
      } catch (error: unknown) {
        setErrors((error as IErrorResponse).errorMessages || []);
      }
    };
    getElections();
  }, []);

  return (
    <section className="results">
      <div className="container results__container">
        <ApiErrorMessage errors={errors} />
        {elections &&
          elections.map((election) => (
            <ResultElection key={election.id} {...election} />
          ))}
      </div>
    </section>
  );
};

export default Results;
