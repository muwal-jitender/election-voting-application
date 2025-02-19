import { Document, Schema, Types, model } from 'mongoose';

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface VoterDocument extends Document {
  id: string;
  fullName: string;
  email: string;
  password: string;
  votedElectionIds: Types.ObjectId[];
  isAdmin: boolean;
}

const voterSchema = new Schema<VoterDocument>({
  id: { type: String, default: uuidv4, unique: true },
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate emails
    index: true,  // Improve query performance
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Validate email
  },
  password: { type: String, required: true, minlength: 8 }, // Enforce password length
  votedElectionIds: [{ type: Types.ObjectId, ref: "Election", required: false }], // Not required initially
  isAdmin: { type: Boolean, default: false, immutable: true }, // Immutable prevents users from making themselves admin
}, { timestamps: true });

// **Hash password before saving**
voterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const VoterModel = model<VoterDocument>("Voter", voterSchema);
