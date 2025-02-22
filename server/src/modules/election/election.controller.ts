// Voter Controller
import "reflect-metadata";

import { Request, Response } from "express";
import { inject, injectable, singleton } from "tsyringe";

import { ElectionDTO } from "./election.dto";
import { ElectionService } from "./election.service";

@injectable()
export class ElectionController {
  constructor(
    @inject(ElectionService) private electionService: ElectionService
  ) {}

  async create(req: Request, res: Response) {
    try {
      const voterData: ElectionDTO = req.body;
      const voter = await this.electionService.create(voterData);
      res.status(201).json(voter);
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async get(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get candidates by election id
   * @param req
   * @param res
   */
  async getCandidatesByElectionId(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  /**
   * Get voters by election id
   * @param req
   * @param res
   */
  async getVotersByElectionId(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Get Voter successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
