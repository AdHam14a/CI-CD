import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/auth.model";
import Jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Wrong" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }
    const token = Jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ message: "Logged in successfully", token, user: user });
  } catch (error) {
    console.error("Error logging in : ", error);
  }
};


export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}