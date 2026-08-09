import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { AuthPayload } from "../types/express"; 

export const verifytoken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "malformed token" });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Forbidden" });
  }
};