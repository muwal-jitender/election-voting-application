import { useEffect, useState } from "react";
import { IAddElection, IElectionModel } from "../../types";

import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { updateElection } from "../../services/election.service";
import { UiActions } from "../../store/ui-slice";

// ✅ Define Props Interface
interface UpdateElectionModalProps {
  election: IElectionModel;
  onElectionUpdated: (updatedElection: IElectionModel) => void;
}

const UpdateElectionModal: React.FC<UpdateElectionModalProps> = ({
  election,
  onElectionUpdated,
}) => {
  const [formData, setFormData] = useState<IAddElection>({
    title: "",
    description: "",
    thumbnail: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (election) {
      setFormData({
        title: election.title,
        description: election.description,
        thumbnail: null,
      });
    }
  }, [election]);

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
      setFormData({ ...formData, thumbnail: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateElection(election?.id, formData);
    onElectionUpdated(response.data as IElectionModel);
    // Close Modal popup
    closeElectionModal();
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
