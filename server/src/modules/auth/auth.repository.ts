import { IRefreshTokenDocument, RefreshTokenModel } from "./auth.model";

import { BaseRepository } from "core/base.repository";
import { singleton } from "tsyringe";

// Voter Repository
@singleton()
export class AuthRepository extends BaseRepository<IRefreshTokenDocument> {
  constructor() {
    super(RefreshTokenModel);
  }
}
