import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { UiActions } from "../store/ui-slice";
import { AddCandidateModel } from "../types";

const AddCandidateModal = () => {
  const [formData, setFormData] = useState<AddCandidateModel>({
    fullName: "",
    image: "",
    motto: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const dispatch = useDispatch();
  const closeAddCandidateModal = () => {
    dispatch(UiActions.closeAddCandidateModal());
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit form data
    console.log("Form submitted", formData);
    if (selectedFile) {
      console.log("Selected file:", selectedFile);
      // Handle file upload logic here
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
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              required
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
              required
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
