import {
  IAddElection,
  ICandidateModel,
  IEditElection,
  IElectionDetail,
  IElectionModel,
  IElectionService,
  IVoterVotedResponse,
} from "types";
import { API_PATH, resolveApiPath } from "utils/api-path.utils";

import { AxiosRequestConfig } from "axios";
import { apiRequest } from "./api-request";

export const electionService: IElectionService = {
  /** Create Election */
  create: async (payload: IAddElection) => {
    // ✅ Create FormData for file upload
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("thumbnail", payload.thumbnail as File);

    // ✅ Configure request headers
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    };
    // ✅ Call the API
    return await apiRequest<IElectionModel>(
      API_PATH.ELECTION,
      "POST",
      formData,
      config,
    );
  },

  /** Update Election */
  update: async (id: string, payload: IEditElection) => {
    // ✅ Create FormData for file upload
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("thumbnail", payload.thumbnail as File);

    // ✅ Configure request headers
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    };
    // ✅ Call the API
    return await apiRequest<IElectionModel>(
      resolveApiPath(API_PATH.ELECTION_ID, { id: id }),
      "PATCH",
      formData,
      config,
    );
  },
  /** Get All Elections */
  getAll: async () => {
    return await apiRequest<IElectionDetail[]>(API_PATH.ELECTION, "GET");
  },
  getResults: async () => {
    return await apiRequest<IElectionDetail[]>(
      API_PATH.ELECTION_RESULTS,
      "GET",
    );
  },
  /** Get All Candidates by Elections id */
  getCandidatesByElectionId: async (id: string) => {
    return await apiRequest<ICandidateModel[]>(
      resolveApiPath(API_PATH.ELECTION_GET_CANDIDATES_BY_ID, { id: id }),
      "GET",
    );
  },
  delete: async (id: string) => {
    return await apiRequest<IElectionModel>(
      resolveApiPath(API_PATH.ELECTION_ID, { id: id }),
      "DELETE",
    );
  },
  checkIfVoterAlreadyVoted: async (id: string) => {
    return await apiRequest<IVoterVotedResponse>(
      resolveApiPath(API_PATH.ELECTION_CHECK_IF_VOTER_ALREADY_VOTED, {
        id: id,
      }),
      "GET",
    );
  },
  getFullDetail: async (id: string) => {
    return await apiRequest<IElectionDetail>(
      resolveApiPath(API_PATH.ELECTION_GET_DETAILS_BY_ID, { id: id }),
      "GET",
    );
  },
};
