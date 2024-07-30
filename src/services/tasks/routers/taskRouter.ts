import express from "express";
import { createTask } from "../controllers/taskController";
import { verifyUser } from "../../../middlewares/verifyUser";

const router = express.Router();

// Define the roles, types, and technologies required for this route
const requiredRoles = ["manager", "projectmanager", "teamlead", "developer"];
const requiredTypes = ["backend", "frontend"];
const requiredTechnologies = ["AI", "odoo", "Nodejs", "Reactjs", "Angular"];

router.post(
  "/tasks",
  verifyUser(requiredRoles, requiredTypes, requiredTechnologies),
  createTask
);

export default router;
