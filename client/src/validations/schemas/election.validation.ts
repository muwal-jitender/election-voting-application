import * as Yup from "yup";

import {
  ALLOWED_FILE_TYPES,
  FILE_SIZE,
  FILE_SIZE_MESSAGE,
  FILE_TYPE_MESSAGE,
} from "validations/validationConstants";

// ✅ Reusable Schemas
const titleSchema = Yup.string().trim().required("Title is required");
const descriptionSchema = Yup.string()
  .trim()
  .required("Description is required");

export const addElectionValidationSchema = Yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  thumbnail: Yup.mixed<File>()
    .required("Thumbnail is required")
    .test("fileType", FILE_TYPE_MESSAGE, (value) => {
      if (!value) return true; // ✅ No file selected, skip validation
      return ALLOWED_FILE_TYPES.includes((value as File).type);
    })
    .test("filesize", FILE_SIZE_MESSAGE, (value) => {
      return value && (value as File).size <= FILE_SIZE;
    }),
});

export const editElectionValidationSchema = Yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  thumbnail: Yup.mixed<File>()
    .optional()
    .nullable()
    .test("fileType", FILE_TYPE_MESSAGE, (value) => {
      if (!value) return true; // ✅ No file selected, skip validation
      return ALLOWED_FILE_TYPES.includes((value as File).type);
    })
    .test("filesize", FILE_SIZE_MESSAGE, (value) => {
      if (!value) return true; // ✅ If no file is uploaded, pass validation
      return value && (value as File).size <= FILE_SIZE;
    }),
});
