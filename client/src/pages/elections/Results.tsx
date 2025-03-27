import "./Results.css";

import React, { useEffect, useState } from "react";

import ResultElection from "components/election/ResultElection";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import { getAllElections } from "services/election.service";
import { IElectionModel } from "types";
import { IErrorResponse } from "types/ResponseModel";

const Results = () => {
  const [elections, setElections] = React.useState<IElectionModel[]>();
  const [errors, setErrors] = useState<string[]>([]); // Empty array

  useEffect(() => {
    const getElections = async () => {
      try {
        const result = await getAllElections();
        setElections(result.data as IElectionModel[]);
      } catch (error: unknown) {
        setErrors((error as IErrorResponse).errorMessages || []);
        console.log((error as IErrorResponse).errorMessages || []);
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
