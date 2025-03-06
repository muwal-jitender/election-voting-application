import React, { useState } from "react";
import { IAddElection, IElectionModel } from "../types";

import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createElection } from "../services/election.service";
import { UiActions } from "../store/ui-slice";

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
    e.preventDefault();
    const response = await createElection(formData);
    console.log(`Response ${response}`);
    onElectionAdded(response.data as IElectionModel);
    // Close Modal popup
    closeElectionModal();
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
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Election Title"
              required
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
              required
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
              required
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
