import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt"; // your token logic

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^bearer\s/gi, "");

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
