import { Document, Schema, Types, model } from 'mongoose';

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface ElectionDocument extends Document {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  candidates: string[];
  voters: string[];
}


const electionSchema = new Schema<ElectionDocument>({
  id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  thumbnail: { type: String, required: true, trim: true },

  candidates: [{ type: Types.ObjectId, ref: "Candidate", required: false }], // Not required initially
  voters: [{ type: Types.ObjectId, ref: "Voter", required: false }], // Not required initially
}, { timestamps: true });



export const ElectionModel = model<ElectionDocument>("Election", electionSchema);
