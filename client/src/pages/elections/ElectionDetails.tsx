import "./ElectionDetails.css";

import { ApiErrorMessage, CloudinaryImage } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICandidateModel, IElectionModel, IVoterModel, RootState } from "types";

import ElectionCandidate from "components/election/ElectionCandidate";
import AddCandidateModal from "components/modals/AddCandidateModal";
import { IoAddOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { electionService } from "services/election.service";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types/ResponseModel";

const ElectionDetails = () => {
  // 🆔 Get election ID from URL params
  const { id } = useParams();
  const dispatch = useDispatch();

  // 🔘 Open add candidate modal
  const openAddCandidateModal = () => {
    dispatch(UiActions.openAddCandidateModal());
  };

  // 📦 Get UI state: whether AddCandidateModal is showing
  const showAddCandidateModal = useSelector(
    (state: RootState) => state.ui.addCandidateModalShowing,
  );

  // 📊 Local state for election data
  const [election, setElection] = useState<IElectionModel>();
  const [candidates, setCandidates] = useState<ICandidateModel[]>();
  const [voters, setVoters] = useState<IVoterModel[]>();
  const [errors, setErrors] = useState<string[]>([]);

  // ✅ Fetch full election details (candidates, voters)
  const getElections = useCallback(async () => {
    try {
      const result = await electionService.getFullDetail(id as string);
      setElection(result.data as IElectionModel);
      setCandidates(result.data?.candidates as ICandidateModel[]);
      setVoters(result.data?.voters as IVoterModel[]);
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  }, [id]);

  // 📥 Fetch election data on component mount
  useEffect(() => {
    getElections();
  }, [getElections]);

  // ➕ Add new candidate to local state after creation
  const handleCandidateAdded = (newCandidate: ICandidateModel) => {
    setCandidates((preCandidates) => [newCandidate, ...(preCandidates || [])]);
  };

  // 🗑️ Remove candidate from local state after deletion
  const handleDeletedCandidate = (deletedCandidate: string) => {
    setCandidates((prevCandidates) =>
      prevCandidates?.filter((candidate) => candidate.id !== deletedCandidate),
    );
  };

  // 🕓 Format timestamp into readable date/time
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
      {/* 📦 Election Detail Section */}
      <section className="election-details">
        <ApiErrorMessage errors={errors} />
        <div className="container election-details__container">
          {/* 🧭 Title, description, and thumbnail */}
          <h2>{election?.title}</h2>
          <p>{election?.description}</p>
          <div className="election-details__image">
            {election && (
              <CloudinaryImage
                alt={election.title}
                cloudinaryUrl={election.thumbnail}
                gravity="center"
                height={240}
                mobileWidth={458}
                mode="fit"
                width={1277}
              />
            )}
          </div>

          {/* 🗳️ List of candidates with delete and add buttons */}
          <ul className="election-details__candidates">
            {candidates &&
              candidates.map((candidate) => (
                <ElectionCandidate
                  key={candidate.id}
                  {...candidate}
                  onCandidateDeleted={handleDeletedCandidate}
                />
              ))}
            <li className="li_add-candidate-btn">
              <button
                className="add__candidate-btn"
                onClick={openAddCandidateModal}
                title="Add new candidate"
                aria-label="Add new candidate"
              >
                <IoAddOutline />
              </button>
            </li>
          </ul>

          {/* 👥 Voter List Table */}
          <section className="voters">
            {voters && voters.length === 0 ? (
              <h2>No Voter has voted so far</h2>
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
                          <h3>{voter.fullName}</h3>
                        </td>
                        <td>{voter.email}</td>
                        <td>{formatDate(voter.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </section>
        </div>
      </section>

      {/* ➕ Add Candidate Modal */}
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
