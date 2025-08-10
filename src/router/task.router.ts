import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/task.controllers";

const routerTask = Router();

routerTask.post("/", createTask);
routerTask.get("/", getAllTasks);
routerTask.get("/:id", getTaskById);
routerTask.put("/:id", updateTask);
routerTask.delete("/:id", deleteTask);

export default routerTask;