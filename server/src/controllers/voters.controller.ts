import { Request, Response } from "express";

//import  voterModel  from "../models/voter.model";

// import { User } from "./auth.model"; // Simulated user model
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// Dummy database (Replace with real DB)


// Secret key for JWT (Use environment variables in production)
const JWT_SECRET = "your_secret_key"; 

// REGISTER USER
export const register = async (req: Request, res: Response) => {
  try {
    // const { fullName, email, password } = req.body;

    // // Check if user already exists
    // const existingEmail = await voterModel.findOne({email});
    // if (existingEmail) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Create new user
    // const newUser: User = { id: users.length + 1, username, email, password: hashedPassword };
    // users.push(newUser); // Save to dummy DB (Replace with real DB call)

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN USER
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user in the database
    // const user = users.find(user => user.email === email);
    // if (!user) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }

    // // Compare password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }

    // // Generate JWT token
    // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    const token ="token";

    res.status(200).json({ message: "Login successful", token });
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