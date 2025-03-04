import "./Results.css";

import React, { useCallback, useEffect, useState } from "react";

import ResultElection from "../components/ResultElection";
import { getAllElections } from "../services/election.service";
import { IElectionModel } from "../types";
import { IErrorResponse } from "../types/ResponseModel";

const Results = () => {
  const [elections, setElections] = React.useState<IElectionModel[]>();
  const [errors, setErrors] = useState<string[]>([]); // Empty array

  const getElections = useCallback(async () => {
    try {
      const result = await getAllElections();
      setElections(result.data as IElectionModel[]);
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  }, []); // No dependencies -> Won't be recreated on each render

  useEffect(() => {
    getElections();
  }, [getElections]); // Now safe to include

  return (
    <section className="results">
      <div className="container results__container">
        {elections &&
          elections.map((election) => (
            <ResultElection key={election.id} {...election} />
          ))}
      </div>
    </section>
  );
};

export default Results;
