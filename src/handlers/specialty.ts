import { Request, Response } from "express";
import Specialty from "../models/Specialty.models";

const postSpecialty = async (req: Request, res: Response) => {
    try {
        const specialty = await Specialty.create(req.body);
        res.status(201).json({ data: specialty });
    } catch (error) {
        console.error("Error al crear la especialidad:", error);
        res.status(500).json({ error: "Error al crear la especialidad." });
    }
}


const getSpecialty = async (req: Request, res: Response) => {
    try {
        const specialties = await Specialty.findAll();
        res.status(200).json({ data: specialties });
    } catch (error) {
        console.error("Error al obtener las especialidades:", error);
        res.status(500).json({ error: "Error al obtener las especialidades." });
    }
}


const getSpecialtyForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const specialty = await Specialty.findByPk(id);
        if (!specialty) {
            return res.status(404).json('La especialidad no existe');
        }
        res.status(200).json({ data: specialty });
    } catch (error) {
        console.error("Error al obtener la especialidad por ID:", error);
        res.status(500).json({ error: "Error al obtener la especialidad." });
    }
}


const putSpecialtyForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const specialty = await Specialty.findByPk(id);
        if (!specialty) {
            return res.status(404).json('La especialidad no existe');
        }
        await specialty.update(req.body);
        res.status(200).json({ data: specialty });
    } catch (error) {
        console.error("Error al actualizar la especialidad:", error);
        res.status(500).json({ error: "Error al actualizar la especialidad." });
    }
}

export {
    postSpecialty,
    getSpecialty,
    getSpecialtyForId,
    putSpecialtyForId
}