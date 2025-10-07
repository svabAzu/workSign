import { Request, Response } from "express";
import GeneralTask from "../models/General_tasks.models";
import Client from "../models/Client.models";
import Jobs from "../models/Jobs.models";
import GeneralTaskStates from "../models/General_task_states.models";
import TypeJob from "../models/Type_job.models"; // Necesario para la inclusión anidada
import GeneralTaskTypeJob from '../models/GeneralTaskTypeJob.models';


const postTask = async (req: Request, res: Response) => {
    try {
        // Si viene un archivo, guardar la ruta en sketch_url
        let sketch_url = req.body.sketch_url;
        if (req.file) {
            sketch_url = req.file.path.replace(/\\/g, '/').replace('uploads/', '/uploads/');
        }
        // Separa los typeJobIds del body
        const { typeJobIds, ...taskData } = req.body;
        // 1. Crear la tarea general
        const task = await GeneralTask.create({ ...taskData, sketch_url });
        // 2. Asociar los TypeJob si se proporcionaron IDs
        if (typeJobIds && typeJobIds.length > 0) {
            await task.$set('typeJobs', typeJobIds);
        }
        // Recarga la tarea con todas sus relaciones
        await task.reload({
            include: [
                Client,
                GeneralTaskStates,
                Jobs,
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });
        res.status(201).json({ data: task });
    } catch (error) {
        console.error("Error al crear la tarea general:", error);
        res.status(500).json({ error: "Error al crear la tarea general." });
    }
}

const getTask = async (req: Request, res: Response) => {
    try {
        const tasks = await GeneralTask.findAll({
            include: [
                Client,
                GeneralTaskStates,
                Jobs,
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error al obtener las tareas generales con relaciones:", error);
        res.status(500).json({ error: "Error al obtener las tareas generales." });
    }
}

const getTaskForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await GeneralTask.findByPk(id, {
            include: [
                Client,
                GeneralTaskStates,
                Jobs,
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });
        if (!task) {
            return res.status(404).json('La tarea general no existe');
        }
        res.status(200).json({ data: task });
    } catch (error) {
        console.error("Error al obtener la tarea general por ID con relaciones:", error);
        res.status(500).json({ error: "Error al obtener la tarea general por ID." });
    }
}

const putTaskForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { typeJobIds, ...taskData } = req.body;
        const task = await GeneralTask.findByPk(id);
        if (!task) {
            return res.status(404).json('La tarea general no existe');
        }
        await task.update(taskData);
        if (typeJobIds && typeJobIds.length > 0) {
            await task.$set('typeJobs', typeJobIds);
        }
        const updatedTask = await GeneralTask.findByPk(id, {
            include: [
                Client,
                GeneralTaskStates,
                Jobs,
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json({ data: updatedTask });
    } catch (error) {
        console.error("Error al actualizar la tarea general:", error);
        res.status(500).json({ error: "Error al actualizar la tarea general." });
    }
}

const updateTaskState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { ID_general_task_states } = req.body;

        const task = await GeneralTask.findByPk(id);

        if (!task) {
            return res.status(404).json('La tarea general no existe');
        }

        await task.update({ ID_general_task_states });

        const updatedTask = await GeneralTask.findByPk(id, {
            include: [
                Client,
                GeneralTaskStates,
                Jobs,
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });

        res.status(200).json({ data: updatedTask });
    } catch (error) {
        console.error("Error al actualizar el estado de la tarea general:", error);
        res.status(500).json({ error: "Error al actualizar el estado de la tarea general." });
    }
}

export {
    postTask,
    getTask,
    getTaskForId,
    putTaskForId,
    updateTaskState
}
