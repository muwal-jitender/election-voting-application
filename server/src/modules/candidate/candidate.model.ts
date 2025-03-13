import { Document, Schema, Types, model } from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface CandidateDocument extends Document {
  fullName: string;
  image: string;
  motto: string;
  voteCount: number;
  electionId: string;
}

const candidateSchema = new Schema<CandidateDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    voteCount: { type: Number, default: 0 },
    electionId: [{ type: Types.ObjectId, ref: "Election", required: false }], // Not required initially
  },
  { timestamps: true }
);

// Convert `_id` to `id` when returning data
candidateSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id.toString(); // Map `_id` to `id`
    delete ret._id; // Remove `_id`
    delete ret.__v; // Remove version key
    return ret;
  },
});

export const CandidateModel = model<CandidateDocument>(
  "Candidate",
  candidateSchema
);
