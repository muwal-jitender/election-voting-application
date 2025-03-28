import {
  IAddElection,
  ICandidateModel,
  IEditElection,
  IElectionDetail,
  IElectionModel,
  IVoterVotedResponse,
} from "types";
import { API_PATH, getApiPath } from "utils/api-path.utils";

import { AxiosRequestConfig } from "axios";
import { apiRequest } from "./api-request";

/** Create Election */
export const createElection = async (payload: IAddElection) => {
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
};
/** Update Election */
export const updateElection = async (id: string, payload: IEditElection) => {
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
    getApiPath(API_PATH.ELECTION_ID, { id: id }),
    "PATCH",
    formData,
    config,
  );
};
/** Get All Elections */
export const getAllElections = async () => {
  return await apiRequest<IElectionDetail[]>(API_PATH.ELECTION, "GET");
};
export const geElectionResults = async () => {
  return await apiRequest<IElectionDetail[]>(API_PATH.ELECTION_RESULTS, "GET");
};
/** Get All Candidates by Elections id */
export const getCandidatesByElectionId = async (id: string) => {
  return await apiRequest<ICandidateModel[]>(
    getApiPath(API_PATH.ELECTION_GET_CANDIDATES_BY_ID, { id: id }),
    "GET",
  );
};
export const deleteElection = async (id: string) => {
  return await apiRequest<IElectionModel>(
    getApiPath(API_PATH.ELECTION_ID, { id: id }),
    "DELETE",
  );
};
export const checkIfVoterAlreadyVoted = async (id: string) => {
  return await apiRequest<IVoterVotedResponse>(
    getApiPath(API_PATH.ELECTION_CHECK_IF_VOTER_ALREADY_VOTED, { id: id }),
    "GET",
  );
};
export const getFullDetail = async (id: string) => {
  return await apiRequest<IElectionDetail>(
    getApiPath(API_PATH.ELECTION_GET_DETAILS_BY_ID, { id: id }),
    "GET",
  );
};
