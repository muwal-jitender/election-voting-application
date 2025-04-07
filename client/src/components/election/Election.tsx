import "react-tooltip/dist/react-tooltip.css";
import "./Election.css";

import { IElectionModel, IErrorResponse } from "types";

import ApiErrorMessage from "components/ui/ApiErrorMessage";
import Button from "components/ui/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { electionService } from "services/election.service";
import { UiActions } from "store/ui-slice";
import { tooltipStyles } from "utils/utils";

const Election = ({
  id,
  title,
  description,
  thumbnail,
  onElectionDeleted,
}: IElectionModel & { onElectionDeleted: (id: string) => void }) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // 🛠 Opens the update election modal pre-filled with current election data
  const openUpdateElectionModal = () => {
    dispatch(
      UiActions.openUpdateElectionModal({ id, title, description, thumbnail }),
    );
  };

  // 🗑 Handles deletion of an election with confirmation dialog and error handling
  const handleDeleteElection = (id: string) => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Are you sure?",
        callback: async () => {
          try {
            await electionService.delete(id);
            onElectionDeleted(id); // Notify parent component of deletion
          } catch (error: unknown) {
            setServerErrors((error as IErrorResponse).errorMessages || []);
          }
        },
      }),
    );
  };

  return (
    // 🧾 Election card container
    <article className="election">
      {/* 🖼 Election thumbnail */}
      <div className="election__image">
        <img src={thumbnail} alt={title} />
      </div>

      {/* 📋 Election title, description, and actions */}
      <div className="election__info">
        <Link to={`/elections/${id}`}>
          <h4>{title}</h4>
        </Link>

        {/* ✏️ Truncated description if too long */}
        <p
          data-tooltip-id="description-tooltip"
          data-tooltip-content={description}
        >
          {description.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>
        <Tooltip id="description-tooltip" place="left" style={tooltipStyles} />
        {/* 🔘 Action buttons: View, Delete, Edit */}
        <div className="election__cta">
          <Link to={`/elections/${id}`} className="btn sm primary">
            View
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteElection(id)}
            assistiveText="Election"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openUpdateElectionModal}
            assistiveText="Election"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* ⚠️ Server-side validation errors, if any */}
      {serverErrors.length > 0 && <ApiErrorMessage errors={serverErrors} />}
    </article>
  );
};

export default Election;
