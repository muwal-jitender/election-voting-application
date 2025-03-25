import { Document, Schema, Types, model } from "mongoose";

export interface ElectionDocument extends Document {
  title: string;
  description: string;
  thumbnail: string;
  candidates: Types.ObjectId[];
  voters: Types.ObjectId[];
}

const electionSchema = new Schema<ElectionDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },

    candidates: [{ type: Types.ObjectId, ref: "Candidate", required: false }], // Not required initially
    voters: [{ type: Types.ObjectId, ref: "Voter", required: false }], // Not required initially
  },
  { timestamps: true }
);

// Convert `_id` to `id` when returning data
electionSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString(); // Map `_id` to `id`
    delete ret._id; // Remove `_id`
    delete ret.__v; // Remove version key
    return ret;
  },
});

export const ElectionModel = model<ElectionDocument>(
  "Election",
  electionSchema
);
