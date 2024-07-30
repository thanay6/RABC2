import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserInstance } from "../services/registration/models/userModel";
import db from "../database/db_connection";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: UserInstance;
  }
}

// Define the structure of the expected token payload
interface TokenPayload {
  id: number;
  email: string;
  role: string[];
  technology: string[];
  type: string[];
}

export const verifyUser = (
  roles: string[],
  types: string[],
  technologies: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as jwt.Secret
      ) as TokenPayload;

      // Ensure the token payload contains all required fields
      if (
        typeof decoded.id !== "number" ||
        typeof decoded.email !== "string" ||
        !Array.isArray(decoded.role) ||
        !Array.isArray(decoded.technology) ||
        !Array.isArray(decoded.type)
      ) {
        throw new Error("Invalid token payload");
      }

      const user = await db.User.findOne({ where: { id: decoded.id } });

      //we ned to change here
      if (
        user &&
        roles.some((role) => user.role.includes(role)) &&
        types.some((type) => user.type.includes(type)) &&
        technologies.some((tech) => user.technology.includes(tech))
      ) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({
          message: "Access denied. Required roles are missing.",
        });
      }
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(400).json({ message: "Invalid token." });
    }
  };
};
