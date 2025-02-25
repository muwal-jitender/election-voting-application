import { Document, Schema, Types, model } from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface CandidateDocument extends Document {
  id: string;
  fullName: string;
  image: string;
  motto: string;
  voteCount: number;
  electionId: string;
}

export interface AddCandidateModel {
  fullName: string;
  image: string;
  motto: string;
}

const candidateSchema = new Schema<CandidateDocument>(
  {
    id: { type: String, default: uuidv4, unique: true },
    fullName: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    voteCount: { type: Number },
    electionId: [{ type: Types.ObjectId, ref: "Election", required: false }], // Not required initially
  },
  { timestamps: true }
);

export const CandidateModel = model<CandidateDocument>(
  "Candidate",
  candidateSchema
);
