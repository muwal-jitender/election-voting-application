import * as Yup from "yup";

import React, { useState } from "react";
import { IAddElection, IElectionModel } from "../../types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createElection } from "../../services/election.service";
import { UiActions } from "../../store/ui-slice";
import { IErrorResponse } from "../../types/ResponseModel";
import ApiErrorMessage from "../ui/ApiErrorMessage";
import FileInput from "../ui/FileInput";
import TextareaInput from "../ui/TextareaInput";
import TextInput from "../ui/TextInput";

interface AddElectionModalProp {
  // ✅ Accept callback prop
  onElectionAdded: (newElection: IElectionModel) => void;
}
const addElectionValidationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  thumbnail: Yup.mixed<File>()
    .required("Thumbnail is required")
    .test("filesize", "File size is too large (max 10MB)", (value) => {
      return value && (value as File).size <= 10 * 1024 * 1024; // ✅ Limits file size to 10MB
    }),
});
const AddElectionModal: React.FC<AddElectionModalProp> = ({
  onElectionAdded,
}) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // Close add election modal
  const closeElectionModal = () => {
    dispatch(UiActions.closeAddElectionModal());
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IAddElection>({
    resolver: yupResolver(addElectionValidationSchema),
  });
  // Handle Form Submission
  const onSubmit = async (formData: IAddElection) => {
    try {
      const response = await createElection(formData);
      onElectionAdded(response.data as IElectionModel);
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
          <h4>Create New Election</h4>
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
              id="thumbnail"
              error={errors.thumbnail}
              setValue={setValue}
              clearErrors={clearErrors}
            />
          </div>
          <button type="submit" className="btn primary">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddElectionModal;
