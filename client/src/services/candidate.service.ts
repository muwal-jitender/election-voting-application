import { IAddCandidateModel, ICandidateModel, ICandidateService } from "types";
import { API_PATH, resolveApiPath } from "utils/api-path.utils";

import { AxiosRequestConfig } from "axios";
import { apiRequest } from "./api-request";

export const candidateService: ICandidateService = {
  /** Create Election */
  create: async (payload: IAddCandidateModel, electionId: string) => {
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
  },
  /** Remove candidate */
  remove: async (id: string) => {
    return await apiRequest<ICandidateModel>(
      resolveApiPath(API_PATH.CANDIDATE_ID, { id: id }),
      "DELETE",
    );
  },
  /** Caste candidate vote */
  vote: async (id: string, electionId: string) => {
    return await apiRequest<ICandidateModel>(
      resolveApiPath(API_PATH.CANDIDATE_VOTE, { id, electionId }),
      "PATCH",
    );
  },
};
