import "./Elections.css";

import { useDispatch, useSelector } from "react-redux";

import { useState } from "react";
import AddElectionModal from "../components/AddElectionModal";
import Election from "../components/Election";
import { elections as dummyElections } from "../data/data";
import { UiActions } from "../store/ui-slice";
import { RootState } from "../types";

const Elections = () => {
  const [elections, setElections] = useState(dummyElections);
  const dispatch = useDispatch();
  const openElectionModal = () => {
    dispatch(UiActions.openAddElectionModal());
  };
  const addElectionModalShow = useSelector(
    (state: RootState) => state.ui.electionModalShowing,
  );
  return (
    <>
      <section className="elections">
        <div className="container elections__container">
          <header className="elections__header">
            <h1>Ongoing Elections</h1>
            <button className="btn primary" onClick={openElectionModal}>
              Create New Election
            </button>
          </header>
          <menu className="elections__menu">
            {elections.map((election) => (
              <Election key={election.id} {...election} />
            ))}
          </menu>
        </div>
      </section>
      {addElectionModalShow && <AddElectionModal />}
    </>
  );
};

export default Elections;
