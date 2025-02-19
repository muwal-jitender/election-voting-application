import {ElectionDocument, ElectionModel} from "./election.model"

import { BaseRepository } from "../../core/base.repository";
import { singleton } from "tsyringe";

// Voter Repository
@singleton()
export class ElectionRepository extends BaseRepository<ElectionDocument> {
  constructor() {
    super(ElectionModel);
  }
}
