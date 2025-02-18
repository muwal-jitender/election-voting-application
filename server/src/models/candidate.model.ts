import { Schema, Types, model } from 'mongoose';

const  candidateSchema = new Schema( {
  fullName: {type: String, required: true},
  image:  {type: String, required: true},
  motto:  {type: String, required: true},
  voteCount:  {type: Number, default: 0},
  electionId:  [{type: Types.ObjectId, ref:"Election",  required: true},],
},{timestamps: true});

export default model("Candidate", candidateSchema);