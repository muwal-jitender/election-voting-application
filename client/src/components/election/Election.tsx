import "./Election.css";

import { IElectionModel, IErrorResponse } from "types";

import ApiErrorMessage from "components/ui/ApiErrorMessage";
import Button from "components/ui/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteElection } from "services/election.service";
import { UiActions } from "store/ui-slice";

const Election = ({
  id,
  title,
  description,
  thumbnail,
  onElectionDeleted,
}: IElectionModel & { onElectionDeleted: (id: string) => void }) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  const openUpdateElectionModal = () => {
    dispatch(
      UiActions.openUpdateElectionModal({ id, title, description, thumbnail }),
    );
  };
  const handleDeleteElection = (id: string) => {
    dispatch(
      UiActions.openConfirmModalDialog({
        heading: "Are you sure?",
        callback: async () => {
          try {
            await deleteElection(id);
            onElectionDeleted(id);
          } catch (error: unknown) {
            setServerErrors((error as IErrorResponse).errorMessages || []);
          }
        },
      }),
    );
  };

  return (
    <article className="election">
      <div className="election__image">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="election__info">
        <Link to={`/elections/${id}`}>
          <h4>{title}</h4>
        </Link>
        <p>
          {description.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>
        <div className="election__cta">
          <Link to={`/elections/${id}`} className="btn sm primary">
            View
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteElection(id)}
          >
            Delete
          </Button>

          <Button variant="primary" size="sm" onClick={openUpdateElectionModal}>
            Edit
          </Button>
        </div>
      </div>
      {serverErrors.length > 0 && <ApiErrorMessage errors={serverErrors} />}
    </article>
  );
};

export default Election;
