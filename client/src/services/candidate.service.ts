import { IAddCandidateModel, ICandidateModel } from "types";
import { API_PATH, getApiPath } from "utils/api-path.utils";

import { AxiosRequestConfig } from "axios";
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

/** Remove candidate */
export const removeCandidate = async (id: string) => {
  return await apiRequest<ICandidateModel>(
    getApiPath(API_PATH.CANDIDATE_ID, { id: id }),
    "DELETE",
  );
};
/** Remove candidate */
export const VoteCandidate = async (id: string, electionId: string) => {
  return await apiRequest<ICandidateModel>(
    getApiPath(API_PATH.CANDIDATE_VOTE, { id, electionId }),
    "PATCH",
  );
};
