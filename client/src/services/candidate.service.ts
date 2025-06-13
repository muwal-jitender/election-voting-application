import { IAddCandidateModel, ICandidateModel, ICandidateService } from "types";
import { CANDIDATE_API, resolveApiPath } from "utils/api-path.utils";

import { AxiosRequestConfig } from "axios";
import { toFormData } from "utils/form-data.util";
import { apiRequest } from "./api-request";

export const candidateService: ICandidateService = {
  /** Create Election */
  create: async (payload: IAddCandidateModel, electionId: string) => {
    // ✅ Create FormData for file upload
    //const formData = new FormData();
    const formData = toFormData({ ...payload, electionId });

    // ✅ Configure request headers
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    };
    // ✅ Call the API
    return await apiRequest<ICandidateModel>(
      CANDIDATE_API.CANDIDATE,
      "POST",
      formData,
      config,
    );
  },
  /** Remove candidate */
  remove: async (id: string) => {
    return await apiRequest<ICandidateModel>(
      resolveApiPath(CANDIDATE_API.CANDIDATE_ID, { id: id }),
      "DELETE",
    );
  },
  /** Caste candidate vote */
  vote: async (id: string, electionId: string) => {
    return await apiRequest<ICandidateModel>(
      resolveApiPath(CANDIDATE_API.CANDIDATE_VOTE, { id, electionId }),
      "PATCH",
    );
  },
};
