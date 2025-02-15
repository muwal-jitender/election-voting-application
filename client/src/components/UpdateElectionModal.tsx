import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { UiActions } from "../store/ui-slice";
import { AddElectionModel } from "../types";

const UpdateElectionModal = () => {
  const [formData, setFormData] = useState<AddElectionModel>({
    title: "",
    description: "",
    thumbnail: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch();

  // Close add election modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeUpdateElectionModal());
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "thumbnail" && files && files.length > 0) {
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
          <h4>Update Election</h4>
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
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElectionModal;
