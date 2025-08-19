import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    getTasksByGeneralTaskId,
    deleteTask
} from "../controllers/task.controllers";

const routerTask = Router();

routerTask.post("/", createTask);
routerTask.get("/", getAllTasks);
routerTask.get("/:id", getTaskById);
routerTask.get("/general/:generalTaskId", getTasksByGeneralTaskId);
routerTask.put("/:id", updateTask);
routerTask.delete("/:id", deleteTask);

export default routerTask;