import {
  ApiErrorMessage,
  Button,
  FileInput,
  TextareaInput,
  TextInput,
} from "components/ui";
import { useEffect, useState } from "react";
import { IAddCandidateModel, ICandidateModel } from "types";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { candidateService } from "services/candidate.service";
import { UiActions } from "store/ui-slice";
import { IErrorResponse } from "types/ResponseModel";
import { addCandidateValidationSchema } from "validations/schemas/candidate.validation";

// 📦 Props for AddCandidateModal
interface AddCandidateModalProp {
  onCandidateAdded: (newCandidate: ICandidateModel) => void;
  electionId: string;
}

const AddCandidateModal: React.FC<AddCandidateModalProp> = ({
  onCandidateAdded,
  electionId,
}) => {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const dispatch = useDispatch();

  // ❌ Close modal
  const closeAddCandidateModal = () => {
    dispatch(UiActions.closeAddCandidateModal());
  };

  // 📋 Setup react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IAddCandidateModel>({
    resolver: yupResolver(addCandidateValidationSchema),
  });

  // 🔗 Set electionId in form when component mounts
  useEffect(() => {
    setValue("electionId", electionId);
  }, [electionId, setValue]);

  // ✅ Submit handler for adding a candidate
  const onSubmit = async (formData: IAddCandidateModel) => {
    try {
      const response = await candidateService.create(formData, electionId);
      toast.success("Candidate added successfully!");
      onCandidateAdded(response.data as ICandidateModel); // Notify parent
      closeAddCandidateModal(); // Close modal on success
    } catch (error: unknown) {
      setServerErrors((error as IErrorResponse).errorMessages || []); // Handle server errors
    }
  };

  return (
    // 🧩 Modal Wrapper
    <section className="modal">
      <div className="modal__content">
        {/* 🧭 Modal Header */}
        <header className="modal__header">
          <h2>Add Candidate</h2>
          <button className="modal__close" onClick={closeAddCandidateModal}>
            <IoMdClose />
          </button>
        </header>

        {/* 📝 Form for new candidate */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ⚠️ Server-side validation errors */}
          <ApiErrorMessage errors={serverErrors} />

          {/* 👤 Full Name Input */}
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

          {/* 🗯️ Motto Input */}
          <div>
            <label htmlFor="motto">Motto</label>
            <TextareaInput
              error={errors.motto}
              id="motto"
              placeholder="motto"
              register={register}
            />
          </div>

          {/* 🖼️ Image Upload */}
          <div>
            <label htmlFor="image">Photo</label>
            <FileInput
              clearErrors={clearErrors}
              error={errors.image}
              id="image"
              setValue={setValue}
            />
          </div>

          {/* ➕ Submit Button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            assistiveText="candidate"
          >
            Add
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
