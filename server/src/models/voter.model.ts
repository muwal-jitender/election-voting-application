import { Schema, Types, model } from 'mongoose';

const  voterSchema = new Schema( {
  fullName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  votedElectionIds: [{type: Types.ObjectId, ref:"Election",  required: true},],
  isAdmin : {type: Boolean, default: false}
},{timestamps: true});

export default model("Voter", voterSchema);