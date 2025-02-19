import {CandidateDocument, CandidateModel} from "./candidate.model"

import { BaseRepository } from "../../core/base.repository";
import { singleton } from "tsyringe";

// Voter Repository
@singleton()
export class CandidateRepository extends BaseRepository<CandidateDocument> {
  constructor() {
    super(CandidateModel);
  }
}
