import "./ElectionDetails.css";

import { useDispatch, useSelector } from "react-redux";
import { candidates, elections, voters } from "../data/data";

import { IoAddOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import AddCandidateModal from "../components/AddCandidateModal";
import ElectionCandidate from "../components/ElectionCandidate";
import { UiActions } from "../store/ui-slice";
import { RootState } from "../types";

const ElectionDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const openAddCandidateModal = () => {
    dispatch(UiActions.openAddCandidateModal());
  };

  const showAddCandidateModal = useSelector(
    (state: RootState) => state.ui.addCandidateModalShowing,
  );

  const election = elections.find((election) => election.id === id);
  const electionCandidate = candidates.filter(
    (candidate) => candidate.electionId === id,
  );
  return (
    <>
      <section className="election-details">
        <div className="container election-details__container">
          <h2>{election?.title}</h2>
          <p>{election?.description}</p>
          <div className="election-details__image">
            <img src={election?.thumbnail} alt={election?.title} />
          </div>
          <menu className="election-details__candidates">
            {electionCandidate.map((candidate) => (
              <ElectionCandidate key={candidate.id} {...candidate} />
            ))}
            <button
              className="add__candidate-btn"
              onClick={openAddCandidateModal}
            >
              <IoAddOutline />
            </button>
          </menu>

          <menu className="voters">
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
                {voters.map((voter) => (
                  <tr key={voter.id}>
                    <td>
                      <h5>{voter.fullName}</h5>
                    </td>
                    <td>{voter.email}</td>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </menu>
        </div>
      </section>
      {showAddCandidateModal && <AddCandidateModal />}
    </>
  );
};

export default ElectionDetails;
