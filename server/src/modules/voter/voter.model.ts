import { Document, Schema, Types, model } from "mongoose";

import bcrypt from "bcryptjs";

export interface VoterDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  votedElectionIds: Types.ObjectId[];
  isAdmin: boolean;
  totpSecret: string; // 🔐 Encrypted or base32 secret
  is2FAEnabled: boolean; // 🛡️ 2FA toggle
}

const voterSchema = new Schema<VoterDocument>(
  {
    fullName: { type: String, required: true, trim: true, lowercase: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // Prevent duplicate emails
      index: true, // Improve query performance
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Validate email
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Enforce password length
      select: false, // Excluded by default from Select query
    },
    votedElectionIds: [
      { type: Types.ObjectId, ref: "Election", required: false },
    ], // Not required initially
    isAdmin: { type: Boolean, default: false, immutable: true }, // Immutable prevents users from making themselves admin
    totpSecret: { type: String, default: null }, // 🔐 Encrypted or base32 secret
    is2FAEnabled: { type: Boolean, default: false }, // 🛡️ 2FA toggle
  },
  { timestamps: true }
);

// Hash password before saving
voterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Convert `_id` to `id` when returning data
voterSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // Map `_id` to `id`
    delete ret._id; // Remove `_id`
    delete ret.__v; // Remove version key
    return ret;
  },
});

export const VoterModel = model<VoterDocument>("Voter", voterSchema);
