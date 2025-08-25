import { Request, Response } from "express";
import GeneralTask from "../models/General_tasks.models";
import Client from "../models/Client.models";
import Jobs from "../models/Jobs.models";
import GeneralTaskStates from "../models/General_task_states.models";
import TypeJob from "../models/Type_job.models"; // Necesario para la inclusión anidada
import GeneralTaskTypeJob from '../models/GeneralTaskTypeJob.models';


const postTask = async (req: Request, res: Response) => {
    try {
        // Separa los typeJobIds del body
        const { typeJobIds, ...taskData } = req.body;
        // 1. Crear la tarea general
        const task = await GeneralTask.create(taskData);
        // 2. Asociar los TypeJob si se proporcionaron IDs
        if (typeJobIds && typeJobIds.length > 0) {
            await task.$set('typeJobs', typeJobIds);
        }
        // 3. Volver a buscar la tarea con sus relaciones
        const taskWithRelations = await GeneralTask.findByPk(task.ID_general_tasks, {
            include: [
                { model: Client, as: 'client' },
                { model: GeneralTaskStates, as: 'generalTaskState' },
                { model: Jobs, as: 'job' },
                {
                    model: TypeJob,
                    as: 'typeJobs',
                    through: { attributes: [] }
                }
            ]
        });
        res.status(201).json({ data: taskWithRelations });
    } catch (error) {
        console.error("Error al crear la tarea general:", error);
        res.status(500).json({ error: "Error al crear la tarea general." });
    }
}

const getTask = async (req: Request, res: Response) => {
    try {
        const tasks = await GeneralTask.findAll({
            include: [
                { model: Client, as: 'client' },
                { model: GeneralTaskStates, as: 'generalTaskState' },
                { model: Jobs, as: 'job' },
                {
                    model: TypeJob,
                    as: 'typeJobs',
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
                { model: Client, as: 'client' },
                { model: GeneralTaskStates, as: 'generalTaskState' },
                { model: Jobs, as: 'job' },
                {
                    model: TypeJob,
                    as: 'typeJobs',
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
                { model: Client, as: 'client' },
                { model: GeneralTaskStates, as: 'generalTaskState' },
                { model: Jobs, as: 'job' },
                {
                    model: TypeJob,
                    as: 'typeJobs',
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

export {
    postTask,
    getTask,
    getTaskForId,
    putTaskForId
}
