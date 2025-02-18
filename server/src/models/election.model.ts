import { Schema, Types, model } from 'mongoose';

const  electionSchema = new Schema( {
  title: {type: String, required: true},
  description: {type: String, required: true},
  thumbnail: {type: String, required: true},
  candidates: [{type: Types.ObjectId, ref:"Candidate",  required: true},],
  voters:  [{type: Types.ObjectId, ref:"Voter",  required: true},],
},{timestamps: true});

export default model("Election", electionSchema);

