// Voter Controller
import "reflect-metadata";

import { Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { RegisterVoterDTO } from "./voter.dto";
import { VoterService } from "./voter.service";

@injectable()
export class VoterController {
  constructor(@inject(VoterService) private voterService: VoterService) {}


  async register(req: Request, res: Response) {
    try {
      const voterData: RegisterVoterDTO = req.body;
      const voter = await this.voterService.registerVoter(voterData);
      res.status(201).json(voter);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const voterData: RegisterVoterDTO = req.body;
      const voter = await this.voterService.registerVoter(voterData);
      res.status(201).json(voter);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const voters = await this.voterService.getAllVoters();
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}