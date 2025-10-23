import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    getTasksByGeneralTaskId,
    deleteTask
} from "../controllers/task.controllers";
import { validateSchema } from "../middlewares/validator.middleware";
import { taskSchema } from "../schemas/task.schema";

const routerTask = Router();

routerTask.post("/", validateSchema(taskSchema), createTask);
routerTask.get("/", getAllTasks);
routerTask.get("/:id", getTaskById);
routerTask.get("/general/:generalTaskId", getTasksByGeneralTaskId);
routerTask.put("/:id", validateSchema(taskSchema), updateTask);
routerTask.delete("/:id", deleteTask);

export default routerTask;