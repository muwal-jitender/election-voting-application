import React, { useState } from "react";
import { IAddElection, IElectionModel } from "../../types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { electionService } from "../../services/election.service";
import { UiActions } from "../../store/ui-slice";
import { IErrorResponse } from "../../types/ResponseModel";
import { addElectionValidationSchema } from "../../validations/schemas/election.validation";
import ApiErrorMessage from "../ui/ApiErrorMessage";
import Button from "../ui/Button";
import FileInput from "../ui/FileInput";
import TextareaInput from "../ui/TextareaInput";
import TextInput from "../ui/TextInput";

// 📦 Props for AddElectionModal
interface AddElectionModalProp {
  onElectionAdded: (newElection: IElectionModel) => void;
}

const AddElectionModal: React.FC<AddElectionModalProp> = ({
  onElectionAdded,
}) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // ❌ Closes the modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeAddElectionModal());
  };

  // 🧾 Form setup with validation schema
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IAddElection>({
    resolver: yupResolver(addElectionValidationSchema),
  });

  // ✅ Form submission logic
  const onSubmit = async (formData: IAddElection) => {
    try {
      const response = await electionService.create(formData);
      onElectionAdded(response.data as IElectionModel); // Notify parent
      closeElectionModal(); // Close modal on success
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
    }
  };

  return (
    // 🧩 Modal container
    <section className="modal">
      <div className="modal__content">
        {/* 🧭 Modal header with title and close button */}
        <header className="modal__header">
          <h2>Create New Election</h2>
          <button
            className="modal__close"
            onClick={closeElectionModal}
            aria-label="Close modal popup"
          >
            <IoMdClose />
          </button>
        </header>

        {/* 📝 Election creation form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ⚠️ Server-side error messages */}
          <ApiErrorMessage errors={serverErrors} />

          {/* 🏷️ Title input */}
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

          {/* 📝 Description input */}
          <div>
            <label htmlFor="description">Description</label>
            <TextareaInput
              error={errors.description}
              id="description"
              placeholder="description"
              register={register}
            />
          </div>

          {/* 🖼️ Thumbnail image input */}
          <div>
            <label htmlFor="thumbnail">Thumbnail</label>
            <FileInput
              id="thumbnail"
              error={errors.thumbnail}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          </div>

          {/* ➕ Submit button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            assistiveText="election"
          >
            Add
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AddElectionModal;
