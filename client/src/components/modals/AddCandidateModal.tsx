import { useEffect, useState } from "react";
import { IAddCandidateModel, ICandidateModel } from "../../types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { createCandidate } from "../../services/candidate.service";
import { UiActions } from "../../store/ui-slice";
import { IErrorResponse } from "../../types/ResponseModel";
import { addCandidateValidationSchema } from "../../validations/schemas/candidate.validation";
import ApiErrorMessage from "../ui/ApiErrorMessage";
import FileInput from "../ui/FileInput";
import TextareaInput from "../ui/TextareaInput";
import TextInput from "../ui/TextInput";

interface AddCandidateModalProp {
  onCandidateAdded: (newElection: ICandidateModel) => void;
  electionId: string;
}
const AddCandidateModal: React.FC<AddCandidateModalProp> = ({
  onCandidateAdded,
  electionId,
}) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]); // Empty array
  const dispatch = useDispatch();
  const closeAddCandidateModal = () => {
    dispatch(UiActions.closeAddCandidateModal());
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IAddCandidateModel>({
    resolver: yupResolver(addCandidateValidationSchema),
  });

  // ✅ Automatically set `electionId` when the component mounts
  useEffect(() => {
    setValue("electionId", electionId);
  }, [electionId, setValue]);

  const onSubmit = async (formData: IAddCandidateModel) => {
    try {
      const response = await createCandidate(formData, electionId);
      onCandidateAdded(response.data as ICandidateModel);
      closeAddCandidateModal();
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <ApiErrorMessage errors={serverErrors} />

          <div>
            <label htmlFor="fullName">Full Name</label>
            <TextInput
              error={errors.fullName}
              id="fullName"
              placeholder="full name"
              register={register}
              type="text"
              autoFocus={true}
            />
          </div>
          <div>
            <label htmlFor="motto">Motto</label>
            <TextareaInput
              error={errors.motto}
              id="motto"
              placeholder="motto"
              register={register}
            />
          </div>
          <div>
            <label htmlFor="image">Photo</label>
            <FileInput
              clearErrors={clearErrors}
              error={errors.image}
              id="image"
              setValue={setValue}
            />
          </div>
          <button type="submit" className="btn primary">
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
