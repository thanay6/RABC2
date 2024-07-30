import { Request, Response } from "express";
import db from "../../../database/db_connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  userValidationSchema,
  loginValidationSchema,
} from "../validations/userValidation";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        message: "Invalid input",
        solution: "Expected an array of users",
      });
    }

    const errorMessages: string[] = [];
    const successMessages: string[] = [];
    const registeredUsers: any[] = [];

    for (const user of users) {
      const { error } = userValidationSchema.validate(user);
      if (error) {
        errorMessages.push(
          `Validation error for user ${user.email}: ${error.details[0].message}`
        );
        continue;
      }

      const { userName, email, password, role, type, technology, phoneNumber } =
        user;

      // Check if the user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        errorMessages.push(`Email already exists for user ${email}`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await db.User.create({
        userName,
        email,
        password: hashedPassword, // Save the hashed password
        role,
        type,
        technology,
        phoneNumber,
      });

      registeredUsers.push(newUser);
      successMessages.push(`User registered successfully for email ${email}`);
    }

    if (errorMessages.length > 0) {
      return res.status(207).json({
        message: "Partial success",
        errors: errorMessages,
        successes: successMessages,
        users: registeredUsers,
      });
    }

    // Send a success response for all users
    return res.status(201).json({
      message: "All users registered successfully",
      users: registeredUsers,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred during registration",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "validation error",
        solution: error.details[0].message,
      });
    }
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "invalid email ",
        solution: "check the email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalid password ",
        solution: "check the password",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        type: user.type,
        technology: user.technology,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: "An error occurred during login",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};
