import React, { useState } from "react";
import { IAddElection, IElectionModel } from "../../types";

import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createElection } from "../../services/election.service";
import { UiActions } from "../../store/ui-slice";
import { IErrorResponse } from "../../types/ResponseModel";

interface AddElectionModalProp {
  // ✅ Accept callback prop
  onElectionAdded: (newElection: IElectionModel) => void;
}
const AddElectionModal: React.FC<AddElectionModalProp> = ({
  onElectionAdded,
}) => {
  const [formData, setFormData] = useState<IAddElection>({
    title: "",
    description: "",
    thumbnail: null,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // Close add election modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeAddElectionModal());
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "thumbnail" && files && files.length > 0) {
      setFormData({ ...formData, thumbnail: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await createElection(formData);
      onElectionAdded(response.data as IElectionModel);
      // Close Modal popup
      closeElectionModal();
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  };
  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Create New Election</h4>
          <button className="modal__close" onClick={closeElectionModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="form__error-message">
              {errors.map((msg, index) => (
                <p key={index}>{`* ${msg}`}</p>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Election Title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Enter Description"
              cols={60}
              rows={10}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="thumbnail">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              onChange={handleChange}
              accept=".png, .jpg, .jpeg, .webp, .avif"
            />
          </div>
          <button type="submit" className="btn primary">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddElectionModal;
