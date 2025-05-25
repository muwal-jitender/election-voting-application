import "./Elections.css";

import { ApiErrorMessage, Button } from "components/ui";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IElectionModel, RootState } from "types";

import Election from "components/election/Election";
import AddElectionModal from "components/modals/AddElectionModal";
import ConfirmModal from "components/modals/ConfirmModal";
import UpdateElectionModal from "components/modals/UpdateElectionModal";
import { electionService } from "services/election.service";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types/ResponseModel";

const Elections = () => {
  // 🗳️ State to hold list of elections and server errors
  const [elections, setElections] = useState<IElectionModel[]>();
  const [errors, setErrors] = useState<string[]>([]);

  const dispatch = useDispatch();

  // ➕ Open the 'Add Election' modal
  const openElectionModal = () => {
    dispatch(UiActions.openAddElectionModal());
  };

  // 🔁 Fetch all elections from API
  const getElections = useCallback(async () => {
    try {
      const result = await electionService.getAll();
      setElections(result.data as IElectionModel[]);
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  }, []);

  // 📥 Load elections when component mounts
  useEffect(() => {
    getElections();
  }, [getElections]);

  // 🔘 Redux selectors for modal state
  const addElectionModalShow = useSelector(
    (state: RootState) => state.ui.electionModalShowing,
  );

  const updateElectionModalShow = useSelector(
    (state: RootState) => state.ui.updateElectionModalShowing,
  );

  const selectedElection = useSelector(
    (state: RootState) => state.ui.selectedElection,
  );

  // ✅ Add new election to local list
  const handleElectionAdded = (newElection: IElectionModel) => {
    setElections((prevElections) => [newElection, ...(prevElections || [])]);
  };

  // ✅ Update election in the local list
  const handleElectionUpdated = (updatedElection: IElectionModel) => {
    setElections((prevElections) =>
      prevElections?.map((e) =>
        e.id === updatedElection.id ? updatedElection : e,
      ),
    );
  };

  // ✅ Remove deleted election from local list
  const handleElectionDeletion = (deletedElectionId: string) => {
    setElections((prevElections) =>
      prevElections?.filter((election) => election.id !== deletedElectionId),
    );
  };

  return (
    <>
      {/* 🧾 Elections Overview Section */}
      <section className="elections">
        <div className="container elections__container">
          {/* ⚠️ Display any server errors */}
          <ApiErrorMessage errors={errors} />

          {/* 🧭 Header with title and 'Create Election' button */}
          <header className="elections__header">
            <h1>
              {elections && elections.length > 0
                ? "Ongoing Elections"
                : "There are currently no elections."}
            </h1>
            <Button variant="primary" onClick={openElectionModal}>
              Create New Election
            </Button>
          </header>

          {/* 📋 Render each election */}
          <menu className="elections__menu">
            {elections &&
              elections.length > 0 &&
              elections.map((election) => (
                <Election
                  key={election.id}
                  {...election}
                  onElectionDeleted={handleElectionDeletion}
                />
              ))}
          </menu>
        </div>
      </section>

      {/* ➕ Add Election Modal */}
      {addElectionModalShow && (
        <AddElectionModal onElectionAdded={handleElectionAdded} />
      )}

      {/* ✏️ Update Election Modal */}
      {updateElectionModalShow && selectedElection && (
        <UpdateElectionModal
          election={selectedElection}
          onElectionUpdated={handleElectionUpdated}
        />
      )}

      {/* ❗ Global Confirm Modal */}
      <ConfirmModal />
    </>
  );
};

export default Elections;
