import { Request, Response } from "express";
import Job from "../models/Jobs.models";
import TypeJob from "../models/Type_job.models";
import { Op } from "sequelize";

const postJob = async (req: Request, res: Response) => {
    // Desestructuramos name, description y el array de IDs de TypeJob
    const { name, description, typeJobIds } = req.body;

    try {
        // 1. Crear el nuevo Job
        const newJob = await Job.create({
            name,
            description
        });

        // 2. Asociar los TypeJob si se proporcionaron IDs
        if (typeJobIds && typeJobIds.length > 0) {
            const existingTypeJobs = await TypeJob.findAll({
                where: {
                    ID_type_job: { [Op.in]: typeJobIds }
                }
            });

            await newJob.$set('typeJobs', existingTypeJobs);
        }

        // 3. Volver a buscar el Job recién creado con sus relaciones
        const jobWithRelations = await Job.findByPk(newJob.dataValues.ID_jobs, {
            include: [
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });

        // 4. Enviar la respuesta exitosa
        if (jobWithRelations) {
            res.status(201).json({ data: jobWithRelations.toJSON() });
        } else {
            res.status(201).json({ data: newJob.toJSON() });
        }

    } catch (error) {
        console.error("Error al crear y asociar el trabajo:", error);
        res.status(500).json({ error: "Error al crear el trabajo o asociar sus tipos." });
    }
}

const getJob = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.findAll({
            include: [
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        });
        res.json({ data: jobs })
    } catch (error) {
        console.error("Error al obtener trabajos:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

const getJobForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const job = await Job.findByPk(id, {
            include: [
                {
                    model: TypeJob,
                    through: { attributes: [] }
                }
            ]
        })
        if (!job) {
            return res.status(404).json('El Job no existe')
        }
        res.json({ data: job })
    } catch (error) {
        console.error("Error al obtener trabajo por ID:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

export {
    postJob,
    getJob,
    getJobForId
}