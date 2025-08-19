import { Request, Response } from "express";
import {
    createTaskHandler,
    getAllTasksHandler,
    getTaskByIdHandler,
    getTasksByGeneralTaskIdHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from "../handlers/task";

/**
 * Crea una nueva tarea específica para una tarea general.
 */
export const createTask = async (req: Request, res: Response) => {
    try {
        const newTask = await createTaskHandler(req.body);
        res.status(201).json({ data: newTask });
    } catch (error) {
        console.error("Error en el controlador al crear la tarea:", error);
        res.status(500).json({ error: "Error al crear la tarea." });
    }
};

/**
 * Obtiene todas las tareas con sus relaciones.
 */
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await getAllTasksHandler();
        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error en el controlador al obtener las tareas:", error);
        res.status(500).json({ error: "Error al obtener las tareas." });
    }
};

/**
 * Obtiene una tarea por su ID con sus relaciones.
 */
export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await getTaskByIdHandler(Number(id));
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada." });
        }
        res.status(200).json({ data: task });
    } catch (error) {
        console.error("Error en el controlador al obtener la tarea por ID:", error);
        res.status(500).json({ error: "Error al obtener la tarea." });
    }
};

export const getTasksByGeneralTaskId = async (req: Request, res: Response) => {
    try {
        const { generalTaskId } = req.params;
        const tasks = await getTasksByGeneralTaskIdHandler(Number(generalTaskId));
        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error en el controlador al obtener las tareas por ID de tarea general:", error);
        res.status(500).json({ error: "Error al obtener las tareas por ID de tarea general." });
    }
};



/**
 * Actualiza una tarea por su ID.
 */
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedTask = await updateTaskHandler(Number(id), req.body);
        if (!updatedTask) {
            return res.status(404).json({ error: "Tarea no encontrada." });
        }
        res.status(200).json({ data: updatedTask });
    } catch (error) {
        console.error("Error en el controlador al actualizar la tarea:", error);
        res.status(500).json({ error: "Error al actualizar la tarea." });
    }
};

/**
 * Elimina una tarea por su ID.
 */
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await deleteTaskHandler(Number(id));
        if (result === 0) {
            return res.status(404).json({ error: "Tarea no encontrada para eliminar." });
        }
        res.status(204).send('Tarea eliminada'); // Código 204 No Content para eliminación exitosa
    } catch (error) {
        console.error("Error en el controlador al eliminar la tarea:", error);
        res.status(500).json({ error: "Error al eliminar la tarea." });
    }
};

