import { IAddCandidateModel, ICandidateModel } from "../types";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createCandidate } from "../services/candidate.service";
import { UiActions } from "../store/ui-slice";
import { IErrorResponse } from "../types/ResponseModel";

interface AddCandidateModalProp {
  onCandidateAdded: (newElection: ICandidateModel) => void;
  electionId: string;
}
const AddCandidateModal: React.FC<AddCandidateModalProp> = ({
  onCandidateAdded,
  electionId,
}) => {
  const [formData, setFormData] = useState<IAddCandidateModel>({
    fullName: "",
    image: null,
    motto: "",
    electionId: "",
  });
  const [errors, setErrors] = useState<string[]>([]); // Empty array
  const dispatch = useDispatch();
  const closeAddCandidateModal = () => {
    dispatch(UiActions.closeAddCandidateModal());
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // Submit form data

      const response = await createCandidate(formData, electionId);
      onCandidateAdded(response.data as ICandidateModel);
      closeAddCandidateModal();
    } catch (error: unknown) {
      setErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Add Candidate</h4>
          <button className="modal__close" onClick={closeAddCandidateModal}>
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
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="motto">Motto</label>
            <textarea
              name="motto"
              id="motto"
              placeholder="Enter Motto"
              cols={60}
              rows={10}
              value={formData.motto}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="image">Photo</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleChange}
              required
              accept=".png, .jpg, .jpeg, .webp, .avif"
            />
          </div>
          <button type="submit" className="btn primary">
            Add
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
