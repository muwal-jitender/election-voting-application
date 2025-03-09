import "./ElectionDetails.css";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ICandidateModel,
  IElectionModel,
  IVoterModel,
  RootState,
} from "../types";

import { IoAddOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import AddCandidateModal from "../components/AddCandidateModal";
import ElectionCandidate from "../components/ElectionCandidate";
import { getFullDetail } from "../services/election.service";
import { UiActions } from "../store/ui-slice";
import { IErrorResponse } from "../types/ResponseModel";

const ElectionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const openAddCandidateModal = () => {
    dispatch(UiActions.openAddCandidateModal());
  };

  const showAddCandidateModal = useSelector(
    (state: RootState) => state.ui.addCandidateModalShowing,
  );

  const [election, setElection] = useState<IElectionModel>();
  const [candidates, setCandidates] = useState<ICandidateModel[]>();
  const [voters, setVoters] = useState<IVoterModel[]>();
  const [errors, setErrors] = useState<string[]>([]);

  /** ✅ Fetch Election Details */
  const getElections = useCallback(async () => {
    try {
      const result = await getFullDetail(id as string);
      setElection(result.data as IElectionModel);
      setCandidates(result.data?.candidates as ICandidateModel[]);
      setVoters(result.data?.voters as IVoterModel[]);
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  }, [id]);

  useEffect(() => {
    getElections();
  }, [getElections]);

  /** ✅ Add Candidate Callback */
  const handleCandidateAdded = (newCandidate: ICandidateModel) => {
    setCandidates((preCandidates) => [newCandidate, ...(preCandidates || [])]);
  };

  /** ✅ Format Date for Voter Table */
  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "...";

  return (
    <>
      <section className="election-details">
        <div className="container election-details__container">
          <h2>{election?.title}</h2>
          <p>{election?.description}</p>
          <div className="election-details__image">
            <img src={election?.thumbnail} alt={election?.title} />
          </div>
          {/* ✅ Candidates Section */}
          <menu className="election-details__candidates">
            {candidates &&
              candidates.map((candidate) => (
                <ElectionCandidate key={candidate.id} {...candidate} />
              ))}
            <button
              className="add__candidate-btn"
              onClick={openAddCandidateModal}
              title="Add new candidate"
            >
              <IoAddOutline />
            </button>
          </menu>
          {/* ✅ Voters Section */}
          <menu className="voters">
            {voters && voters.length === 0 ? (
              <h2>No Voter have voted so far</h2>
            ) : (
              <>
                <h2>Voters</h2>
                <table className="voters__table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voters?.map((voter) => (
                      <tr key={voter.id}>
                        <td>
                          <h5>{voter.fullName}</h5>
                        </td>
                        <td>{voter.email}</td>
                        <td>{formatDate(voter.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </menu>
        </div>
      </section>
      {/* ✅ Add Candidate Modal */}
      {showAddCandidateModal && (
        <AddCandidateModal
          onCandidateAdded={handleCandidateAdded}
          electionId={id as string}
        />
      )}
    </>
  );
};

export default ElectionDetails;
