import { Request, Response } from "express";

export const create = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const get = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const remove = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get candidates by election id
 * @param req 
 * @param res 
 */
export const getCandidatesByElectionId = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Get voters by election id
 * @param req 
 * @param res 
 */
export const getVotersByElectionId = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Get Voter successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};