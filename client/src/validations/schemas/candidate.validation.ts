import * as Yup from "yup";

import {
  ALLOWED_FILE_TYPES,
  FILE_SIZE,
  FILE_SIZE_MESSAGE,
  FILE_TYPE_MESSAGE,
} from "../validationConstants";

export const addCandidateValidationSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Fullname is required"),
  motto: Yup.string().trim().required("Motto is required"),
  image: Yup.mixed<File>()
    .required("image is required")
    .test("fileType", FILE_TYPE_MESSAGE, (value) => {
      if (!value) return true; // ✅ No file selected, skip validation
      return ALLOWED_FILE_TYPES.includes((value as File).type);
    })
    .test("filesize", FILE_SIZE_MESSAGE, (value) => {
      return value && (value as File).size <= FILE_SIZE;
    }),
  electionId: Yup.string().required(),
});
