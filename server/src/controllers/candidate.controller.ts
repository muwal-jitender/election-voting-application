import { Request, Response } from "express";

export const create = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Candidate added successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const get = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Candidate added successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Vote Candidate
 * @param req 
 * @param res 
 */
export const update = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Candidate added successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const remove = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Candidate added successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};