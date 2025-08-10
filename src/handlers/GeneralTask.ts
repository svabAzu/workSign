import { Request, Response } from "express";
import GeneralTask from "../models/General_tasks.models";
import Client from "../models/Client.models";
import Jobs from "../models/Jobs.models";
import GeneralTaskStates from "../models/General_task_states.models";
import TypeJob from "../models/Type_job.models"; // Necesario para la inclusión anidada


const postTask = async (req: Request, res: Response) => {
    try {
        const task = await GeneralTask.create(req.body);
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
                {
                    model: Client,
                    as: 'client' 
                },
                {
                    model: GeneralTaskStates,
                    as: 'generalTaskState' 
                },
                {
                    model: Jobs,
                    as: 'job', 
                    include: [ 
                        {
                            model: TypeJob,
                            as: 'typeJobs', 
                            through: { attributes: [] } // Evita traer la tabla intermedia
                        }
                    ]
                }
            ]
        });
        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error("Error al obtener las tareas generales con relaciones:", error);
        res.status(500).json({ error: "Error al obtener las tareas generales." });
    }
}

/**
 * Obtiene una tarea general por ID con sus relaciones
 */
const getTaskForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await GeneralTask.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client'
                },
                {
                    model: GeneralTaskStates,
                    as: 'generalTaskState'
                },
                {
                    model: Jobs,
                    as: 'job',
                    include: [
                        {
                            model: TypeJob,
                            as: 'typeJobs',
                            through: { attributes: [] }
                        }
                    ]
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
        const task = await GeneralTask.findByPk(id);
        if (!task) {
            return res.status(404).json('La tarea general no existe');
        }
        await task.update(req.body);
        res.status(200).json({ data: task });
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
