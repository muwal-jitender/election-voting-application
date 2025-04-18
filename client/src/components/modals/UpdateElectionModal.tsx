import { IEditElection, IElectionModel } from "types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { electionService } from "services/election.service";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types/ResponseModel";
import { editElectionValidationSchema } from "validations/schemas/election.validation";
import ApiErrorMessage from "../ui/ApiErrorMessage";
import Button from "../ui/Button";
import FileInput from "../ui/FileInput";
import TextareaInput from "../ui/TextareaInput";
import TextInput from "../ui/TextInput";

// 📦 Props interface for update modal
interface UpdateElectionModalProps {
  election: IElectionModel;
  onElectionUpdated: (updatedElection: IElectionModel) => void;
}

const UpdateElectionModal: React.FC<UpdateElectionModalProps> = ({
  election,
  onElectionUpdated,
}) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // 📋 Setup form with validation and default values
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

  // ❌ Close the update election modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeUpdateElectionModal());
  };

  // ✅ Submit updated election details
  const onSubmit = async (formData: IEditElection) => {
    try {
      const response = await electionService.update(election?.id, formData);
      toast.success("Election updated successfully!");
      onElectionUpdated(response.data as IElectionModel); // Notify parent
      closeElectionModal(); // Close modal on success
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    // 🧩 Modal container
    <section className="modal">
      <div className="modal__content">
        {/* 🧭 Modal header */}
        <header className="modal__header">
          <h2>Update Election</h2>
          <button
            className="modal__close"
            onClick={closeElectionModal}
            aria-label="Close modal popup"
          >
            <IoMdClose />
          </button>
        </header>

        {/* 📝 Update Election Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ⚠️ Display server-side error messages if any */}
          <ApiErrorMessage errors={serverErrors} />

          {/* 🏷️ Title Input */}
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

          {/* 📝 Description Input */}
          <div>
            <label htmlFor="description">Description</label>
            <TextareaInput
              error={errors.description}
              id="description"
              placeholder="description"
              register={register}
            />
          </div>

          {/* 🖼️ Thumbnail File Input */}
          <div>
            <label htmlFor="thumbnail">Thumbnail</label>
            <FileInput
              clearErrors={clearErrors}
              error={errors.thumbnail}
              id="thumbnail"
              setValue={setValue}
            />
          </div>

          {/* 📨 Submit Button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            assistiveText="election"
          >
            Update
          </Button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElectionModal;
