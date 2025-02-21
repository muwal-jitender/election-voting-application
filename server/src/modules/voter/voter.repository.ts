import { VoterDocument, VoterModel } from "./voter.model";

import { BaseRepository } from "../../core/base.repository";
import { singleton } from "tsyringe";

// Voter Repository
@singleton()
export class VoterRepository extends BaseRepository<VoterDocument> {
  constructor() {
    super(VoterModel);
  }
}
