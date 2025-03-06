import { IAddCandidateModel, ICandidateModel } from "../types";

import { AxiosRequestConfig } from "axios";
import { API_PATH } from "../utils/api-path.utils";
import { apiRequest } from "./api-request";

/** Create Election */
export const createCandidate = async (
  payload: IAddCandidateModel,
  electionId: string,
) => {
  // ✅ Create FormData for file upload
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("motto", payload.motto);
  formData.append("electionId", electionId);
  formData.append("image", payload.image as File);

  // ✅ Configure request headers
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
  };
  // ✅ Call the API
  return await apiRequest<ICandidateModel>(
    API_PATH.CANDIDATE,
    "POST",
    formData,
    config,
  );
};
