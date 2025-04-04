import "./Results.css";

import { useEffect, useState } from "react";

import ResultElection from "components/election/ResultElection";
import ApiErrorMessage from "components/ui/ApiErrorMessage";
import { electionService } from "services/election.service";
import { IElectionDetail } from "types";
import { IErrorResponse } from "types/ResponseModel";

const Results = () => {
  // 📦 State for fetched election results
  const [elections, setElections] = useState<IElectionDetail[]>();
  const [errors, setErrors] = useState<string[]>([]); // 🔴 Server-side errors

  // 📥 Fetch election results on component mount
  useEffect(() => {
    const getElections = async () => {
      try {
        const result = await electionService.getResults();
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
        {/* ⚠️ Display error messages if API call fails */}
        <ApiErrorMessage errors={errors} />

        {/* 🗳️ Render each election result */}
        {elections &&
          elections.map((election) => (
            <ResultElection key={election.id} {...election} />
          ))}
      </div>
    </section>
  );
};

export default Results;
