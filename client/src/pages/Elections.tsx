import "./Elections.css";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IElectionModel, RootState } from "../types";

import AddElectionModal from "../components/AddElectionModal";
import Election from "../components/Election";
import UpdateElectionModal from "../components/UpdateElectionModal";
import { getAllElections } from "../services/election.service";
import { UiActions } from "../store/ui-slice";
import { IErrorResponse } from "../types/ResponseModel";

const Elections = () => {
  const [elections, setElections] = useState<IElectionModel[]>();
  const [errors, setErrors] = useState<string[]>([]); // Empty array

  const dispatch = useDispatch();
  const openElectionModal = () => {
    dispatch(UiActions.openAddElectionModal());
  };

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

  // ✅ Show add new election Modal popup
  const addElectionModalShow = useSelector(
    (state: RootState) => state.ui.electionModalShowing,
  );
  // ✅ Show edit election Modal popup
  const updateElectionModalShow = useSelector(
    (state: RootState) => state.ui.updateElectionModalShowing,
  );
  const selectedElection = useSelector(
    (state: RootState) => state.ui.selectedElection,
  );
  // ✅ Callback function to update elections when a new election is added
  const handleElectionAdded = (newElection: IElectionModel) => {
    setElections((prevElections) => [newElection, ...(prevElections || [])]);
  };
  // ✅ Callback function to update election in the list
  const handleElectionUpdated = (updatedElection: IElectionModel) => {
    setElections((prevElections) =>
      prevElections?.map((e) =>
        e.id === updatedElection.id ? updatedElection : e,
      ),
    );
  };

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
            {elections &&
              elections.length > 0 &&
              elections.map((election) => (
                <Election key={election.id} {...election} />
              ))}
          </menu>
        </div>
      </section>
      {addElectionModalShow && (
        <AddElectionModal onElectionAdded={handleElectionAdded} />
      )}
      {updateElectionModalShow && selectedElection && (
        <UpdateElectionModal
          election={selectedElection}
          onElectionUpdated={handleElectionUpdated}
        />
      )}
    </>
  );
};

export default Elections;
