import { Request, Response } from "express";
import db from "../../../database/db_connection";

const validRoles = ["manager", "projectmanager", "teamlead", "developer"];
const validTypes = ["backend", "frontend"];
const validTechnologies = ["AI", "oodo", "nodejs", "reactjs", "angular"];

// Define the role hierarchy with explicit typing
const roleHierarchy: { [key: string]: string[] } = {
  manager: ["projectmanager"],
  projectmanager: ["teamlead"],
  teamlead: ["developer"],
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, email, type, technology } = req.body;

    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = req.user.id as number;
    const userRole = req.user.role[0]; // Assume role is a single element array
    const userTechnologies = req.user.technology;
    const userTypes = req.user.type;

    // Find member by email
    const member = await db.User.findOne({ where: { email } });
    if (!member) {
      return res.status(404).json({
        message: "User not found",
        solution: "Check the email address",
      });
    }

    const memberRole = member.role[0]; // Assume role is a single element array
    const memberTechnologies = member.technology;
    const memberTypes = member.type;

    // Validate role hierarchy
    if (
      !roleHierarchy[userRole] ||
      !roleHierarchy[userRole].includes(memberRole)
    ) {
      return res.status(403).json({
        message: `${userRole} is not able to give tasks to ${memberRole}`,
        solution: `Provide task to a valid role according to the hierarchy`,
      });
    }

    // Validate type
    if (!validTypes.includes(type) || !userTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid or unsupported type`,
        solution: `Provide a task with a valid type: ${validTypes.join(", ")}`,
      });
    }

    // Validate technology
    if (
      !validTechnologies.includes(technology) ||
      !userTechnologies.includes(technology)
    ) {
      return res.status(400).json({
        message: `Invalid or unsupported technology`,
        solution: `Provide a task with a valid technology: ${validTechnologies.join(
          ", "
        )}`,
      });
    }

    const createdTask = await db.Task.create({
      title,
      description,
      completed: false,
      userId: member.id,
      providerId: userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the task",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};
