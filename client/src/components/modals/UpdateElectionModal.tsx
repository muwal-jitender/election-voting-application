import { IEditElection, IElectionModel } from "../../types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { updateElection } from "../../services/election.service";
import { UiActions } from "../../store/ui-slice";
import { IErrorResponse } from "../../types/ResponseModel";
import { editElectionValidationSchema } from "../../validations/schemas/election.validation";
import ApiErrorMessage from "../ui/ApiErrorMessage";
import FileInput from "../ui/FileInput";
import TextareaInput from "../ui/TextareaInput";
import TextInput from "../ui/TextInput";

// ✅ Define Props Interface
interface UpdateElectionModalProps {
  election: IElectionModel;
  onElectionUpdated: (updatedElection: IElectionModel) => void;
}

const UpdateElectionModal: React.FC<UpdateElectionModalProps> = ({
  election,
  onElectionUpdated,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IEditElection>({
    resolver: yupResolver(editElectionValidationSchema),
    defaultValues: {
      description: election.description,
      title: election.title,
      thumbnail: null,
    },
  });

  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // Close add election modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeUpdateElectionModal());
  };

  // Handle Form Submission
  const onSubmit = async (formData: IEditElection) => {
    try {
      const response = await updateElection(election?.id, formData);
      onElectionUpdated(response.data as IElectionModel);
      // Close Modal popup
      closeElectionModal();
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ✅ Display Server-Side Validation Error messages */}
          <ApiErrorMessage errors={serverErrors} />

          <div>
            <label htmlFor="title">Title</label>
            <TextInput
              error={errors.title}
              id="title"
              placeholder="title"
              register={register}
              type="text"
              autoFocus={true}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <TextareaInput
              error={errors.description}
              id="description"
              placeholder="description"
              register={register}
            />
          </div>
          <div>
            <label htmlFor="thumbnail">Thumbnail</label>
            <FileInput
              clearErrors={clearErrors}
              error={errors.thumbnail}
              id="thumbnail"
              setValue={setValue}
            />
          </div>
          <button type="submit" className="btn primary">
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElectionModal;
