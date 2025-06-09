import { ElectionDocument, ElectionModel } from "./election.model";

import { BaseRepository } from "core/base.repository";
import { CandidateDocument } from "modules/candidate/candidate.model";
import { VoterDocument } from "modules/voter/voter.model";
import { singleton } from "tsyringe";

type ElectionPopulateMap = {
  candidates: (keyof CandidateDocument)[];
  voters: (keyof VoterDocument)[];
};
// Voter Repository
@singleton()
export class ElectionRepository extends BaseRepository<
  ElectionDocument,
  ElectionPopulateMap
> {
  constructor() {
    super(ElectionModel);
  }
}
